# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
	
	dependencies = [
        ('course_overviews', '0019_courseoverview_is_new'),
    ]
    
	operations = [
		migrations.AddField(
			model_name='courseoverview',
			name='availability',
			field=models.TextField(default=False),
		),
	]
