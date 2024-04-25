from django.urls import path
from . import views
from django.conf import settings
from django.contrib.auth import views as auth_views

urlpatterns = [
path('api/login', views.loginAPI),
path('csrf_token/', views.csrf_token_endpoint, name='csrf_token_endpoint'),
path('api/register', views.registerAPI),
path("password_reset/", views.password_reset_request, name="password_reset_request"),
path('reset/<token>/', views.CustomPasswordResetConfirmView.as_view(template_name="password_reset_confirm.html"), name='password_reset_confirm'),
path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(
    template_name='password_reset_done.html'), name='password_reset_done'),
path('reset/done/', auth_views.PasswordResetCompleteView.as_view(
    template_name='password_reset_complete.html'), name='password_reset_complete'),
path('api/addnewdictionary', views.addNewDictionaryAPI),
path('api/fetchstandards', views.fetchStandards),
path('api/standars/search', views.searchStandard),
path('test', views.test),
path('api/addnewproject', views.addNewProject),
path('api/fetchprojects', views.fetchProjects),
path('api/users/search', views.searchUser),
path('api/users/update/member', views.updateUserMember)
]