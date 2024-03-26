from rest_framework import serializers
from .models import Names, Roles, Users, Projects
from django.contrib.auth.hashers import make_password


class ProjectsSerializer(serializers.ModelSerializer):
    name = serializers.CharField()

    class Meta:
        model = Projects
        fields = ['name']


class UsersSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    class Meta:
        model = Users
        fields = ['email', 'password']
    
    def create(self, validated_data):
        print(validated_data)

        # role_name = validated_data.pop('role')  # Retrieve role name from validated data
        password = validated_data.pop('password')
        hashed_password = make_password(password)


        # name = Name.objects.get(name=role_name)
        
        # Retrieve Role instance based on the provided role name
        role_instance = Roles.objects.get(role = "user")
        
        user = Users.objects.create(role=role_instance, password= hashed_password, **validated_data)
        return user
