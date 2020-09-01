"""
Certificates API v0 URLs.
"""
from django.conf import settings
from django.conf.urls import include, url

from lms.djangoapps.certificates.apis.v0 import views

CERTIFICATES_URLS = [
    url(
        r'^{username}/courses/{course_id}/$'.format(
            username=settings.USERNAME_PATTERN,
            course_id=settings.COURSE_ID_PATTERN
        ),
        views.CertificatesDetailView.as_view(), name='detail'
    ),
    url(
        r'^courses/{course_id}/$'.format(
            course_id=settings.COURSE_ID_PATTERN
        ),
        views.CertificatesListView.as_view(), name='list'
    ),

]

urlpatterns = [
    url(r'^certificates/', include(CERTIFICATES_URLS, namespace='certificates')),
]
