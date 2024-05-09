from rest_framework import serializers
from .models import Names, Roles, Users, Projects, Standard, OptionDictMapping, StandardDictMapping, Dictionary, Options, StandardProjectMapping
from django.contrib.auth.hashers import make_password


class StandardTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.CharField()

class DynamicTypeListField(serializers.ListField):
    def to_representation(self, data):
        print(data)
        return [{'id': item['id'], 'type': self.field_name} for item in data]

    def to_internal_value(self, data):
        print(data)
        return [{'id': item['id'], 'type': item['type']} for item in data]

class ProjectsSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name.name')
    id = serializers.IntegerField(required=False)
    standardID = serializers.ListField(child = serializers.IntegerField(), required=False)
    standards = serializers.DictField(required=False)
    standardName = serializers.SerializerMethodField(required=False)

    class Meta:
        model = Projects
        fields = ['id', 'name', 'standardID', 'standardName', 'standards']

    def get_name(self, obj):
        return obj.name.name if obj.name else None
    
    def get_standardName(self, obj):
        if obj.id is not None:
            projectDictMapping = obj.standardprojectmapping_set.all().prefetch_related('standard')
            standardNames = []
            for standard_mapping in projectDictMapping:
                standard = standard_mapping.standard
                standardNames.append(standard.name.name)
            return(standardNames)

class ProjectWithStandardsSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name.name')
    standards_by_type = serializers.SerializerMethodField()

    class Meta:
        model = Projects
        fields = ['id', 'name', 'standards_by_type']

    def get_standards_by_type(self, project):
        mappings = StandardProjectMapping.objects.filter(project=project)
        standards_by_type = {}
        for mapping in mappings:
            type_name = mapping.type.type
            if type_name not in standards_by_type:
                standards_by_type[type_name] = []
            standard = mapping.standard
            standards_by_type[type_name].append(StandardWithDictionarySerializer(standard).data)
        return standards_by_type
    
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Options
        fields = ['key', 'value']

class DictionarySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name.name')
    options = serializers.SerializerMethodField()

    class Meta:
        model = Dictionary
        fields = ['name', 'options']

    def get_options(self, dictionary):
        mappings = OptionDictMapping.objects.filter(dictionary=dictionary)
        options_dict = {}
        for mapping in mappings:
            option = mapping.option
            options_dict[option.key] = option.value
        return options_dict
    
class StandardWithDictionarySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name.name')
    dividers = serializers.CharField(source='divider.divider_str',required=False)
    dictionaries = serializers.SerializerMethodField()

    class Meta:
        model = Standard
        fields = ['id', 'name', 'dividers', 'dictionaries']

    def get_dictionaries(self, standard):
        mappings = StandardDictMapping.objects.filter(standard=standard)
        dictionaries = []
        for mapping in mappings:
            dictionary = mapping.dictionary
            serialized_dict = DictionarySerializer(dictionary).data
            dictionaries.append(serialized_dict)
        return dictionaries
            
        
class StandardDataSerializer(serializers.ModelSerializer):
    # You can include related fields from ForeignKey relationships using SerializerMethodField
    id = serializers.IntegerField(required=False)
    name = serializers.SerializerMethodField()
    dividers = serializers.CharField(source='divider.divider_str',required=False)
    dict_data = serializers.SerializerMethodField(required=False)

    class Meta:
        model = Standard
        fields = ['id', 'name', 'dividers','dict_data']

    def get_dict_data(self, obj):
        if obj.id is not None:
            standard_dict_mappings = obj.standarddictmapping_set.all().prefetch_related('dictionary', 'dictionary__optiondictmapping_set')
            dicts = []
            
            for mapping in standard_dict_mappings:
                dictionary_data = {
                    "name": mapping.dictionary.name.name,
                    "id": mapping.dictionary.pk,
                    "options": {optMap.option.key : optMap.option.value for optMap in mapping.dictionary.optiondictmapping_set.all()}
                }
                dicts.append(dictionary_data)
            return DictsDataSerializer(dicts, many=True).data
        else:
            return None


    def get_name(self, obj):
        # This method fetches the name associated with the Standard object
        if obj.name:
            return obj.name.name  # Assuming 'name' is a CharField in the 'Names' model
        else:
            return None



class StandardSerializer(serializers.ModelSerializer):
    # You can include related fields from ForeignKey relationships using SerializerMethodField
    name = serializers.CharField(source='name.name')
    id = serializers.IntegerField(required = False)

    class Meta:
        model = Standard
        fields = ['id', 'name']

class UsersInProjectSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    isInProject = serializers.BooleanField(required=False)
    
    class Meta:
        model = Users
        fields = ['email', "isInProject"]

class UsersSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    isInProject = serializers.BooleanField(required=False)
    
    class Meta:
        model = Users
        fields = ['email', 'password', "isInProject"]
    
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

class TokenSerializer(serializers.Serializer):
    token = serializers.CharField()
    standard_id = serializers.CharField(required = False)

class DictsDataSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    id = serializers.IntegerField(required = False)
    options = serializers.DictField(required = False)

    class Meta:
        fields = ['id', "name", "options"]

class NewStandartSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(source='name.name')
    dividers = serializers.CharField(required=False)
    dict_data = serializers.ListField(child=DictsDataSerializer(), required=False)
    
    


    class Meta:
        model = Standard
        fields = ['id', 'name', 'dividers', 'dict_data']

    def get_name(self, obj):
        return obj.name.name if obj.name else None