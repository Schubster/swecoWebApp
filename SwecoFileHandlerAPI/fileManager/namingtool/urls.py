from django.urls import path
from . import views
from django.conf import settings

urlpatterns = [
path('', views.getData),
path('newUser/', views.postUser),
path('getAllUsers', views.getUsers),
path('api/login', views.loginAPI),
path('csrf_token/', views.csrf_token_endpoint, name='csrf_token_endpoint'),
path('api/register', views.registerAPI),
path('test', views.test),
]