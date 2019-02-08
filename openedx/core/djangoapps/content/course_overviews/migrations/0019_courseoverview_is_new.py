# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
	
	dependencies = [
        ('course_overviews', '0018_courseoverview_timetable'),
    ]
    
	operations = [
		migrations.AddField(
			model_name='courseoverview',
			name='is_new',
			field=models.BooleanField(default=False),
		),
	]
