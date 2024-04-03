from django import forms

class RegisterForm(forms.Form):
    firstname = forms.CharField()
    lastname = forms.CharField()
    email = forms.EmailField()
    password = forms.PasswordInput()


class DictionaryForm(forms.Form):
    name = forms.CharField()
    dicts = forms.CharField(widget=forms.Textarea)