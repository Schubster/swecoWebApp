from pyexpat.errors import messages
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse, reverse_lazy
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from django.views.generic import TemplateView
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.hashers import make_password
from .models import (Users, Names, Projects, Type, UserProjectMapping, Dictionary, Options, Dividers,
                    OptionDictMapping, Standard, StandardDictMapping, StandardProjectMapping, BlacklistedToken)
from .serializer import (ProjectWithStandardsSerializer, UsersSerializer, ProjectsSerializer, DictsDataSerializer, StandardSerializer,
                         TokenSerializer, StandardDataSerializer, NewStandartSerializer, UsersInProjectSerializer)
from django.http import BadHeaderError, Http404, HttpResponse, HttpResponseRedirect, JsonResponse
from django.db.models import Q, Case, When, BooleanField, Exists, OuterRef, Count
import django.db.models.functions as dbFunc
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.hashers import check_password
from .forms import PasswordResetRequestForm, NewPasswordForm
from django.db import transaction
import traceback
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import jwt



# Create your views here.






@csrf_protect
@api_view(['POST'])
def loginAPI(request):
    try:
        if request.method != 'POST':
            return Response({'error': 'Method not allowed'}, status=405)
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

        if not check_password(password, user.password):
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

            # Assuming you have a function to generate JWT tokens securely
        token = generate_token(user.pk, timedelta(days=1))
        context = {'token': token, 'email': user.email}
        if user.role.role == "admin":
            return JsonResponse(context, status=201)
        return JsonResponse(context, status=201)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)
    




@api_view(['POST'])
def registerAPI(request):
    serializer = UsersSerializer(data=request.data)
    if serializer.is_valid():
        print("se:", serializer.validated_data)
        email = serializer.validated_data['email']


        if(Users.objects.filter(email = email).exists()):
            return JsonResponse({'error': 'email in use'}, status=400)
        
        serializer.save()
        #print(serializer)
        return JsonResponse({'response': 'account created successfuly'}, status=201)
    else:
            # Data is invalid, return validation errors
        Response({'error': 'Method not allowed'}, status=405)


@api_view(['POST'])
def addnewstandard(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        token = request.data["token"]
        response = validate_admin(TokenSerializer(data={"token": token}))  # Check user validation
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        serializer = NewStandartSerializer(data=request.data)
        if serializer.is_valid():
            standard_name = serializer.data['name']
            standard_id = serializer.data.get("standardID", None)
            if standard_id == None:
                if Standard.objects.filter(name__name=standard_name).exists():
                    return Response({'error': "that standard name is taken"}, status=status.HTTP_400_BAD_REQUEST)
                standard_name,_ = Names.objects.get_or_create(name=standard_name)
                standard = Standard.objects.create(name=standard_name)
                mapDictData(serializer.data.get('dict_data', []), standard)
            print(serializer.data)
            standard = Standard.objects.get(id=standard_id)
            standard.standarddictmapping_set.all().prefetch_related('dictionary', 'dictionary__optiondictmapping_set').delete()
            mapDictData(serializer.data.get('dict_data', []), standard)
            standards = Standard.objects.all()[:21]
            serializer = StandardSerializer(standards, many=True)  # Serialize queryset
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return JsonResponse({'error': 'somthing went wrong'}, status=500)
@transaction.atomic
def mapDictData(dict_data, standard_instance):
    created_dicts = []
    new_standarddict_mappings = []
    new_options_mapping = []
    for data in dict_data:
        dictionary_name = data.get('name')
        options = data.get('options', {})
        name_instense,_ = Names.objects.get_or_create(name=dictionary_name)
        dictionary_query = Dictionary.objects.filter(name__name=dictionary_name)
        dictionary_query = dictionary_query.annotate(matching_options_count=Count('optiondictmapping'))
        for key, value in options.items():
            dictionary_query = dictionary_query.filter(optiondictmapping__option__key=key, optiondictmapping__option__value=value)
        # Filter dictionaries where the count of matching options is equal to the total number of options
        dictionary_query = dictionary_query.filter(matching_options_count=len(options))
        if dictionary_query.exists():
            new_standarddict_mappings.append(StandardDictMapping(dictionary=dictionary_query.first(), standard=standard_instance))
        else:
            new_dict = Dictionary.objects.create(name=name_instense)
            for key, value in options.items():
                new_option,_ = Options.objects.get_or_create(key=key, value=value)
                new_options_mapping.append(OptionDictMapping(dictionary=new_dict, option=new_option))
            new_standarddict_mappings.append(StandardDictMapping(dictionary=new_dict, standard=standard_instance))
    OptionDictMapping.objects.bulk_create(new_options_mapping)
    StandardDictMapping.objects.bulk_create(new_standarddict_mappings)

@api_view(['POST'])
def fetchStandards(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        data = TokenSerializer(data=request.data)
        response = validate_admin(data)  # Check user validation
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        if "standard_id" in data.validated_data:
            standard_id = data.validated_data["standard_id"]
            standard = Standard.objects.filter(id = standard_id)[0]
            serializer = StandardDataSerializer(standard)
            return Response(serializer.data)
        standards = Standard.objects.all()[:21]
        serializer = StandardSerializer(standards, many=True)  # Serialize queryset
        return Response(serializer.data)

    except Exception as e:
        traceback.print_exc()
        print(e)
        return JsonResponse({'error': 'somthing went wrong'}, status=500)
    

@api_view(['POST'])
def addNewProject(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        if not "token" in request.data:
            return JsonResponse({'error': 'session token required'}, status=400)
        token = request.data["token"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if not isinstance(response, Users):
            return response
        serializer = ProjectsSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse({'error': serializer.errors}, status=400)
        projectNameStr = serializer.validated_data.get("name").get("name")
        standardsData = serializer.validated_data["standards"]
        standards = {type:  Standard.objects.filter(id__in=standardList) for type, standardList in standardsData.items()}
        projectName,existed = Names.objects.get_or_create(name=projectNameStr)
        if not existed:
            return JsonResponse({'error': 'a project with that name already exists'}, status=400)
        if not all([sorted([standard.id for standard in standards.get(type)]) == sorted(list) for type, list in standardsData.items()]):
             return JsonResponse({'error': 'the selected standards cant be found'}, status=400)
        newProject = Projects(name=projectName)
        mappings = [StandardProjectMapping(project=newProject,standard=standard,type=Type.objects.get(type=type)) for type, standard_list in standards.items() for standard in standard_list]
        newProject.save()
        StandardProjectMapping.objects.bulk_create(mappings)
        return JsonResponse({'response': 'project created successfuly'}, status=201)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)
    

@api_view(["post"])
def fetchAllProjectStandards(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        if not "token" in request.data:
            return JsonResponse({'error': 'session token required'}, status=400)
        token = request.data["token"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        projectID = request.data["projectID"]
        project = Projects.objects.filter(id = projectID)
        if not project.exists():
            return JsonResponse({'error': 'project could not be found'}, status=400)
        serializer = ProjectWithStandardsSerializer(project.first())
        return Response(serializer.data, status=200)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)

    
@api_view(["post"])
def fetchProjects(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        serializer = TokenSerializer(data=request.data)
        print(serializer)
        response = validate_user(serializer)  # Check user validation
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        user = response
        if user.role.id > 1:
            projects = Projects.objects.all()
            serializedProjects = ProjectsSerializer(projects, many=True)
            return Response(serializedProjects.data, status=200)
        projects = ProjectsSerializer(Projects.objects.filter(userprojectmapping__user=user),many=True)
        return Response(projects.data, status=200)

    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)
    
@api_view(["post"])
def removeStandard(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        token = request.data["token"]
        standardID = request.data["standardID"]
        projectID = request.data["projectID"]
        standardType = request.data["type"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        # Retrieve the project object
        project = Projects.objects.filter(id=projectID)
        if not project.exists():
            return JsonResponse({'error': 'The project can\'t be found'}, status=status.HTTP_400_BAD_REQUEST)

        standard = Standard.objects.filter(id=standardID)
        if not standard.exists():
            return JsonResponse({'error': 'The standard can\'t be found'}, status=status.HTTP_400_BAD_REQUEST)

        standard_type = Type.objects.filter(type=standardType)
        if not standard_type.exists():
            return JsonResponse({'error': 'The standard type can\'t be found'}, status=status.HTTP_400_BAD_REQUEST)

        mapping = StandardProjectMapping.objects.filter(standard=standard.first(), project=project.first(), type=standard_type.first())
        if not mapping.exists():
            return JsonResponse({'error': 'It seems like that standard is not a part of the project'}, status=status.HTTP_400_BAD_REQUEST)

        mapping.delete()
        serializer = ProjectWithStandardsSerializer(project.first())
        return Response({"project":serializer.data, "message": "Standard removed successfully"}, status=status.HTTP_202_ACCEPTED)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["post"])
def addStandard(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        token = request.data["token"]
        standardID = request.data["standardID"]
        projectID = request.data["projectID"]
        standardType = request.data["type"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        # Retrieve the project object
        project = Projects.objects.filter(id=projectID)
        if not project.exists():
            return JsonResponse({'error': 'The project can\'t be found'}, status=status.HTTP_400_BAD_REQUEST)

        standard = Standard.objects.filter(id=standardID)
        if not standard.exists():
            return JsonResponse({'error': 'The standard can\'t be found'}, status=status.HTTP_400_BAD_REQUEST)

        standard_type = Type.objects.filter(type=standardType)
        if not standard_type.exists():
            return JsonResponse({'error': 'The standard type can\'t be found'}, status=status.HTTP_400_BAD_REQUEST)

        mapping, created = StandardProjectMapping.objects.get_or_create(standard=standard.first(),project=project.first(),type=standard_type.first())
        if not created:
            return JsonResponse({'error': 'It seems like that standard is already a part of the project'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProjectWithStandardsSerializer(project.first())
        return Response({"project":serializer.data, "message": "Standard added successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["post"])
def updateProjectName(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        token = request.data["token"]
        projectID = request.data["projectID"]
        newName = request.data["name"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        # Retrieve the project object
        if not Projects.objects.filter(id=projectID).exists():
            return JsonResponse({'error': 'The project can\'t be found'}, status=status.HTTP_400_BAD_REQUEST)
        project = Projects.objects.filter(id=projectID).first()
        projectName,_ = Names.objects.get_or_create(name=newName)
        if Projects.objects.filter(name = projectName).exists():
            return JsonResponse({'error': 'a project with that name already exists'}, status=status.HTTP_400_BAD_REQUEST)
        project.name = projectName
        project.save()
        serializer = ProjectWithStandardsSerializer(project)
        return Response({"project":serializer.data, "message": "name updated successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["post"])
def searchUser(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        token = request.data["token"]
        userFilter = request.data["filter"]
        projectID = request.data["projectID"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        # Retrieve the project object
        project = Projects.objects.filter(id=projectID)[:1]
        if(not project.exists()):
           return JsonResponse({'error': 'The project cant be found'}, status=400)
        searchStr = request.data["searchString"]
        serializer = queryUserByStr(searchStr, project, userFilter)
        return Response(serializer.data, status=200)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)
    
@api_view(["post"])
def updateUserMember(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        token = request.data["token"]
        projectID = request.data["projectID"]
        userFilter = request.data["filter"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        try:
            project = Projects.objects.get(id=projectID)
        except Projects.DoesNotExist:
            return JsonResponse({"error": "The project cannot be found"}, status=400)
        email = request.data["email"]
        user = Users.objects.filter(email=email)[0]
        try:
            UserProjectMapping.objects.get(user=user, project=project).delete()
        except UserProjectMapping.DoesNotExist:
            UserProjectMapping.objects.create(user=user, project=project)
        searchStr = request.data["searchString"]
        serializer = queryUserByStr(searchStr, project, userFilter)
        return Response(serializer.data, status=200)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)
    
def queryUserByStr(searchStr, project, filter="all"):
    # Start by filtering users based on the search string and role
    users = Users.objects.filter(email__icontains=searchStr, role=1)

    # Annotate whether each user is in the project or not
    users = users.annotate(isInProject = Exists(UserProjectMapping.objects.filter(user=OuterRef('pk'), project=project)))
    print(filter)

    # Apply additional filters based on the 'filter' parameter
    if filter == 'In':
        users = users.filter(isInProject=True)
    elif filter == 'NotIn':
        users = users.filter(isInProject=False)
    
    # Order users by email length
    users = users.annotate(email_length=dbFunc.Length('email')).order_by('email_length')[:9]

    # Serialize users
    serializer = UsersInProjectSerializer(users, many=True)

    return serializer
    
@api_view(["post"])
def searchStandard(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        token = request.data["token"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if not isinstance(response, Users):  # If response is not an instance of Users
            return response
        searchStr = request.data["searchString"]
        standards = Standard.objects.filter(name__name__icontains=searchStr)
        # Annotate each standard with the length of the name
        standards = standards.annotate(name_length=dbFunc.Length('name__name'))
        # Sort the standards by the length of the name
        standards = standards.order_by('name_length')[:21]
        serializer = StandardSerializer(standards, many=True)
        return Response(serializer.data, status=200)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)
    


def password_reset_request(request):
    context={}
    if request.method == "POST":
        password_reset_form = PasswordResetRequestForm(request.POST)
        if password_reset_form.is_valid():
            data = password_reset_form.cleaned_data['email']
            associated_users = Users.objects.filter(Q(email=data))
            if associated_users.exists():
                user = associated_users[0]
                # Generate a token for the user
                token = generate_token(user.id, timedelta(minutes=30))
                # Construct the reset password URL with the token
                reset_url = reverse('password_reset_confirm', kwargs={'token': token})
                reset_url = request.build_absolute_uri(reset_url)
                
                subject = "Password Reset Requested"
                html_message = render_to_string('password_reset_email.html', {'reset_url': reset_url})
                plain_message = strip_tags(html_message)
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [user.email]
                
                try:
                    send_mail(subject, plain_message, email_from, recipient_list, html_message=html_message)
                    return redirect("done/")
                except BadHeaderError:
                    context["error"] = "could not send email"
            else:
                context["error"] = "that email could not be link with any current users"
    password_reset_form = PasswordResetRequestForm()
    context["password_reset_form"] = password_reset_form
    return render(request=request, template_name="password_reset_request.html",
                  context=context)
    
class CustomPasswordResetConfirmView(TemplateView):
    complete = 'password_reset_complete.html'
    reset = 'password_reset.html'
    resetForm = NewPasswordForm
    def get(self, request, token):
        try:
            self.sessiontoken = token
            user_id = check_token_user(token)
            user = get_object_or_404(Users, pk=user_id)
            return render(request, self.reset, {'form': self.resetForm})
        except jwt.ExpiredSignatureError as e:
            return render(request, self.reset, {'error': "session expired"})
        except jwt.InvalidTokenError as e:
            # Handle invalid tokens
            return render(request, self.reset, {'error': "invalid session token"})
        except Exception as e:
            # Handle invalid token
            return render(request, self.reset, {'error': "somthing went wrong"})
    def post(self, request, token):
        context = {"form": self.resetForm}

        try:
            form = self.resetForm(request.POST)

            if form.is_valid():
                newPassword = form.cleaned_data["newPassword"]
                confirmPassword = form.cleaned_data["confirmPassword"]
                
                if newPassword != confirmPassword:
                    context["error"] = "The passwords did not match"
                    return render(request, self.reset, context=context, status=400)
                
                user = get_object_or_404(Users, pk=check_token_user(token))
                hashed_password = make_password(newPassword)
                user.password = hashed_password
                user.save()
                
                # Invalidate the token
                BlacklistedToken.objects.create(token=token)

                return render(request, self.complete)
        except jwt.ExpiredSignatureError as e:
            return render(request, self.reset, {'error': "Session expired"}, status=400)
        except jwt.InvalidTokenError as e:
            return render(request, self.reset, {'error': "Invalid session token"}, status=400)
        except Exception as e:
            raise Http404("Something went wrong")

        return render(request, self.reset, {'error': "Something went wrong"}, status=500)
        
    


def validate_user(data):
        if not data.is_valid():
            return JsonResponse({'error': 'invalid data format'}, status=400)
        try:
            user_id = check_token_user(data.validated_data["token"])
            return Users.objects.get(id = user_id)
        except Exception as e:
            return JsonResponse({'error': e})
        
def validate_admin(data):
        if not data.is_valid():
            return JsonResponse({'error': 'invalid data format'}, status=400)
        try:
            user_id = check_token_user(data.validated_data["token"])
            if Users.objects.filter(id = user_id)[0].role.id < 2:
                return JsonResponse({'error': 'invalid user permissions'}, status=400)
            return Users.objects.get(id = user_id)
        except Exception as e:
            return JsonResponse({'error': e})

def generate_token(user_id, time):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + time,  # Token expiry time
        'iat': datetime.utcnow()  # Issued at
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

def check_token_user(token):
    try:
        # Decode the token using the SECRET_KEY
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        # Extract the user ID from the payload
        user_id = payload['user_id']

        if BlacklistedToken.objects.filter(token=token).exists():
            raise jwt.InvalidTokenError("Token is blacklisted")
        # Return the user ID
        return user_id
    except jwt.ExpiredSignatureError as e:
        # Handle expired tokens
        print('Token expired:', e)
        raise e
    except jwt.InvalidTokenError as e:
        # Handle invalid tokens
        print('Invalid token:', e)
        raise e


def csrf_token_endpoint(request):
    if request.method == 'GET':
        # Retrieve the CSRF token
        csrf_token = get_token(request)
        # Return the CSRF token in a JSON response
        return JsonResponse({'csrfToken': csrf_token})
    else:
        # Method not allowed
        return JsonResponse({'error': 'Method not allowed'}, status=405)



def test(request):
    return render(request, "namingtool/adminprojects.html")