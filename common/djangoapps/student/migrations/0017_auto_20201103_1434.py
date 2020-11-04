# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2020-11-03 13:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0016_auto_20180814_1813'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='name_change_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='languageproficiency',
            name='code',
            field=models.CharField(choices=[['pl', 'Polish'], ['en', 'English']], help_text='The ISO 639-1 language code for this language.', max_length=16),
        ),
    ]
