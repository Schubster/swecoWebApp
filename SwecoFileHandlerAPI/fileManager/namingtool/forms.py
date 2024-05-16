from django import forms
from django.contrib.auth.forms import PasswordResetForm
from django.utils.translation import gettext_lazy as _

class PasswordResetRequestForm(PasswordResetForm):
    email = forms.EmailField(label=_("Email"), max_length=254)

    def send_mail(self, subject_template_name, email_template_name, context, from_email, to_email, html_email_template_name=None):
        # Custom logic for sending the email
        # Use Django's send_mail or any other email-sending method
        pass
class NewPasswordForm(forms.Form):
    newPassword = forms.CharField(min_length=6, widget=forms.PasswordInput(attrs={'class' : 'form-control'}))
    confirmPassword = forms.CharField(min_length=6, widget=forms.PasswordInput(attrs={'class' : 'form-control'}))