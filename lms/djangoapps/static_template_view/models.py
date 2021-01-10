# -*- coding: utf-8 -*-
from django.db import models
from django.forms import ModelForm

class Newsletter_emails(models.Model):
    class Meta(object):
        app_label = "static_template_view"

    created_at = models.DateTimeField(auto_now_add=True)
    email = models.EmailField(max_length=254)

class Newsletter_emailsForm(ModelForm):
    class Meta:
        model = Newsletter_emails
        fields = ['email']