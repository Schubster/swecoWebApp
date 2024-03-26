from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Users, Names, Projects, UserProjectMapping
from .serializer import UsersSerializer, ProjectsSerializer
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from .forms import RegisterForm
import traceback


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
        user = Users.objects.get(email=email)
        
        projects = ProjectsSerializer([mapping.project for mapping in UserProjectMapping.objects.filter(user = user)], many=True)
        print(projects)
        context = {'token': token, 'email': user.email, 'projects':projects.data}
        if user.role.role == "admin":
            return JsonResponse(context, status=201)
        return JsonResponse(context, status=201)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'error': 'somthing went wrong'}, status=405)
    




@api_view(['POST'])
def registerAPI(request):
    serializer = UsersSerializer(data=request.data)
    if serializer.is_valid():
        print("se:", serializer.validated_data)
        email = serializer.validated_data['email']
        if(Users.objects.filter(email = email).exists()):
            return JsonResponse({'error': 'email in use'}, status=201)
        
        serializer.save()
        #print(serializer)
        return JsonResponse({'response': 'account created successfuly'}, status=201)
    else:
            # Data is invalid, return validation errors
        Response({'error': 'Method not allowed'}, status=405)





def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1),  # Token expiry time
        'iat': datetime.utcnow()  # Issued at
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token


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