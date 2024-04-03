# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models




class Names(models.Model):
    name = models.CharField(unique=True, max_length=45)

    class Meta:
        managed = False
        db_table = 'names'


class Dictionary(models.Model):
    name = models.ForeignKey(Names, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dictionary'


class Options(models.Model):
    key = models.CharField(max_length=10, blank=True, null=True)
    value = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'options'


class Projects(models.Model):
    name = models.ForeignKey(Names, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'projects'


class Roles(models.Model):
    id = models.AutoField(primary_key=True)
    role = models.CharField(unique=True, max_length=45)

    class Meta:
        managed = False
        db_table = 'roles'


class Standard(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.ForeignKey(Names, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'standard'

class Users(models.Model):
    email = models.CharField(unique=True, max_length=60)
    password = models.CharField(max_length=200, blank=True, null=True)
    role = models.ForeignKey(Roles, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'


class StandardDictMapping(models.Model):
    id = models.AutoField(primary_key=True)
    standard = models.ForeignKey(Standard, models.DO_NOTHING, blank=True, null=True)
    dictionary = models.ForeignKey(Dictionary, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'standard_dict_mapping'


class StandardProjectMapping(models.Model):
    id = models.AutoField(primary_key=True)
    standard = models.ForeignKey(Standard, models.DO_NOTHING)
    project = models.ForeignKey(Projects, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'standard_project_mapping'

class UserProjectMapping(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, models.DO_NOTHING)
    project = models.ForeignKey(Projects, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'user_project_mapping'


class OptionDictMapping(models.Model):
    id = models.AutoField(primary_key=True)
    dictionary = models.ForeignKey(Dictionary, models.DO_NOTHING, blank=True, null=True)
    option = models.ForeignKey(Options, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'option_dict_mapping'