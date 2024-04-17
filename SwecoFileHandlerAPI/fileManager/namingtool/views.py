from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import (Users, Names, Projects, UserProjectMapping, Dictionary, Options,
                    OptionDictMapping, Standard, StandardDictMapping, StandardProjectMapping, )
from .serializer import (UsersSerializer, ProjectsSerializer, DictsDataSerializer, StandardSerializer,
                         TokenSerializer, StandardDataSerializer, NewStandartSerializer, UsersInProjectSerializer)
from django.http import JsonResponse
from django.db.models import Q, Case, When, BooleanField, Exists, OuterRef
import django.db.models.functions as dbFunc
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from .forms import RegisterForm, DictionaryForm
import traceback
import json
from rest_framework.decorators import parser_classes
from rest_framework.parsers import JSONParser


# Create your views here.
@api_view(['GET'])
def getData(request):
    app = Users.objects.all()
    serializer = UsersSerializer(app, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def postUser(request):
    serializer = UsersSerializer(data=request.data)
    if serializer.is_valid():
            # Data is valid, save it to the database
        serializer.save()
        print(serializer)
        return Response(serializer.data, status=201)
    else:
            # Data is invalid, return validation errors
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def getUsers(request):
    users = Users.objects.all()
    serializer = UsersSerializer(users, many=True)
    return Response(serializer.data)


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
        token = generate_token(user.pk)
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
def addNewDictionaryAPI(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        print(request.data)
        token = request.data["token"]
        response = validate_admin(TokenSerializer(data={"token": token}))  # Check user validation
        if response:  # If response is not None
            return response
        serializer = NewStandartSerializer(data=request.data)
        if serializer.is_valid():
            # Validated data is available as serializer.validated_data
            #print(serializer.validated_data)
            id = serializer.validated_data.get('id')
            standard_name,nameInUse = Names.objects.get_or_create(name = serializer.validated_data.get("name").get("name"))
            dicts = serializer.validated_data.get('dict_data')
            if Standard.objects.filter(id = id).exists():
                standard = Standard.objects.get(id=id)
                standard.name = standard_name
                standard_dict_mapping = standard.standarddictmapping_set.all().prefetch_related('dictionary', 'dictionary__optiondictmapping_set')
                print(standard_dict_mapping)
                return JsonResponse({'error': 'update'}, status=400)
            if not nameInUse:
                return JsonResponse({'error': 'a standard with that name already exists'}, status=400)
            standard = Standard.objects.create(name=standard_name)
            standard_id = standard.id
            # Create dictionaries and their mappings
            dicts_to_create = []
            option_mappings_to_create = []

            for index, dict_data in enumerate(dicts):
                dict_name, _ = Names.objects.get_or_create(name=f"{standard_name.name}_dict{index}")
                new_dict, _ = Dictionary.objects.get_or_create(name=dict_name)
                dicts_to_create.append(StandardDictMapping(standard=standard, dictionary=new_dict))

                # Create and associate Option objects with the Dictionary objects
                for key, value in dict_data['options'].items():
                    option, _ = Options.objects.get_or_create(key=key, value=value)
                    option_mapping = OptionDictMapping(dictionary=new_dict, option=option)
                    option_mappings_to_create.append(option_mapping)

            # Bulk create StandardDictMapping objects
            StandardDictMapping.objects.bulk_create(dicts_to_create)

            # Bulk create OptionDictMapping objects
            OptionDictMapping.objects.bulk_create(option_mappings_to_create)
            standard = Standard.objects.all()
            serializer = StandardSerializer(standard, many=True)
            return Response(serializer.data)
        else:
            # If data is invalid, return error response
            return Response({"error": serializer.errors}, status=400)

    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)

@api_view(['POST'])
def fetchStandards(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        data = TokenSerializer(data=request.data)
        response = validate_admin(data)  # Check user validation
        if response:  # If response is not None
            return response
        if "standard_id" in data.validated_data:
            standard_id = data.validated_data["standard_id"]
            standard = Standard.objects.filter(id = standard_id)[0]
            serializer = StandardDataSerializer(standard)
            return Response(serializer.data)
        standards = Standard.objects.all()
        serializer = StandardSerializer(standards, many=True)  # Serialize queryset
        return Response(serializer.data)

    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)
    

@api_view(['POST'])
def addNewProject(request):
    try:
        
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        if not "token" in request.data:
            return JsonResponse({'error': 'session token required'}, status=400)
        token = request.data["token"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if response:  # If response is not None
            return response
        print(request.data)
        serializer = ProjectsSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse({'error': serializer.errors}, status=400)
        
        projectNameStr = serializer.validated_data.get("name").get("name")
        standardsID = serializer.validated_data["standardID"]
        print(standardsID)
        standards = Standard.objects.filter(id__in=standardsID) 
        projectName,_ = Names.objects.get_or_create(name=projectNameStr)
        if Projects.objects.filter(name=projectName.id).exists():
            return JsonResponse({'error': 'a project with that name already exists'}, status=400)
        if len(standardsID) > len(standards):
             return JsonResponse({'error': 'the selected standards cant be found'}, status=400)

        newProject = Projects.objects.create(name=projectName)
        mappings = []
        for standard in standards:
            mapping = StandardProjectMapping(project=newProject, standard=standard)
            mappings.append(mapping)
    
        # Bulk create the mappings
        StandardProjectMapping.objects.bulk_create(mappings)
        newProject.save()

        return JsonResponse({'response': 'project created successfuly'}, status=201)
        
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
        if isinstance(response, JsonResponse):  # Check if response is JsonResponse
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
def searchUser(request):
    try:
        if not request.method == 'POST':
            return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        token = request.data["token"]
        userFilter = request.data["filter"]
        projectID = request.data["projectID"]
        response = validate_admin(TokenSerializer(data={"token": token}))
        if response:
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
        if response:
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
        print(users)
    
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
        if response:  # If response is not None
            return response
        searchStr = request.data["searchString"]
        standards = Standard.objects.filter(name__name__icontains=searchStr)
        # Annotate each standard with the length of the name
        standards = standards.annotate(name_length=dbFunc.Length('name__name'))
        # Sort the standards by the length of the name
        standards = standards.order_by('name_length')[:9]
        serializer = StandardSerializer(standards, many=True)
        return Response(serializer.data, status=200)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=500)
    


def validate_user(data):
        if not data.is_valid():
            return JsonResponse({'error': 'invalid data format'}, status=400)
        user_id = check_token_user(data.validated_data["token"])
        if not user_id:
            return JsonResponse({'error': 'invalid token'}, status=400)
        if not Users.objects.filter(id = user_id).exists():
            return JsonResponse({'error': 'login session expired'}, status=400)
        return Users.objects.get(id = user_id)
        
def validate_admin(data):
        if not data.is_valid():
            return JsonResponse({'error': 'invalid data format'}, status=400)
        user_id = check_token_user(data.validated_data["token"])
        if not user_id:
            return JsonResponse({'error': 'invalid token'}, status=400)
        if not Users.objects.filter(id = user_id).exists():
            return JsonResponse({'error': 'login session expired'}, status=400)
        if Users.objects.filter(id = user_id)[0].role.id < 2:
            return JsonResponse({'error': 'invalid user permissions'}, status=400)

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1),  # Token expiry time
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
        # Return the user ID
        return user_id
    except jwt.ExpiredSignatureError:
        # Handle expired tokens
        print('Token expired')
        return None
    except jwt.InvalidTokenError:
        # Handle invalid tokens
        print('Invalid token')
        return None


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