# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.forms import ModelForm

class Newsletter_emails(models.Model):
    class Meta(object):
        app_label = "static_template_view"

    created_at = models.DateTimeField(auto_now_add=True)
    email = models.CharField(max_length=255)

    def clean(self):
        try:
            validate_email( self.email )
            return True
        except ValidationError:
            raise ValidationError(_('You must enter valid E-mail address.'))
            return False

class Newsletter_emailsForm(ModelForm):
    class Meta:
        model = Newsletter_emails
        fields = ['email']