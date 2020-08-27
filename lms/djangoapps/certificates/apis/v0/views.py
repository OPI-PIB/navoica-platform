""" API v0 views. """
import logging

from django.http import HttpResponse
from edx_rest_framework_extensions.authentication import JwtAuthentication
from opaque_keys import InvalidKeyError
from opaque_keys.edx.keys import CourseKey
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from lms.djangoapps.certificates.api import get_certificate_for_user
from openedx.core.lib.api import authentication, permissions
from student.models import CourseEnrollmentManager

log = logging.getLogger(__name__)


class CertificatesDetailView(GenericAPIView):
    """
        **Use Case**

            * Get the details of a certificate for a specific user in a course.

        **Example Request**

            GET /api/certificates/v0/certificates/{username}/courses/{course_id}

        **GET Parameters**

            A GET request must include the following parameters.

            * username: A string representation of an user's username.
            * course_id: A string representation of a Course ID.

        **GET Response Values**

            If the request for information about the Certificate is successful, an HTTP 200 "OK" response
            is returned.

            The HTTP 200 response has the following values.

            * username: A string representation of an user's username passed in the request.

            * course_id: A string representation of a Course ID.

            * certificate_type: A string representation of the certificate type.
                Can be honor|verified|professional

            * created_date: Date/time the certificate was created, in ISO-8661 format.

            * status: A string representation of the certificate status.

            * is_passing: True if the certificate has a passing status, False if not.

            * download_url: A string representation of the certificate url.

            * grade: A string representation of a float for the user's course grade.

        **Example GET Response**

            {
                "username": "bob",
                "course_id": "edX/DemoX/Demo_Course",
                "certificate_type": "verified",
                "created_date": "2015-12-03T13:14:28+0000",
                "status": "downloadable",
                "is_passing": true,
                "download_url": "http://www.example.com/cert.pdf",
                "grade": "0.98"
            }
    """

    authentication_classes = (
        authentication.OAuth2AuthenticationAllowInactiveUser,
        authentication.SessionAuthenticationAllowInactiveUser,
        JwtAuthentication,
    )
    permission_classes = (
        IsAuthenticated,
        permissions.IsUserInUrlOrStaff
    )

    def get(self, request, username, course_id):
        """
        Gets a certificate information.

        Args:
            request (Request): Django request object.
            username (string): URI element specifying the user's username.
            course_id (string): URI element specifying the course location.

        Return:
            A JSON serialized representation of the certificate.
        """
        try:
            course_key = CourseKey.from_string(course_id)
        except InvalidKeyError:
            log.warning('Course ID string "%s" is not valid', course_id)
            return Response(
                status=404,
                data={'error_code': 'course_id_not_valid'}
            )

        user_cert = get_certificate_for_user(username=username, course_key=course_key)
        if user_cert is None:
            return Response(
                status=404,
                data={'error_code': 'no_certificate_for_user'}
            )
        return Response(
            {
                "username": user_cert.get('username'),
                "course_id": unicode(user_cert.get('course_key')),
                "certificate_type": user_cert.get('type'),
                "created_date": user_cert.get('created'),
                "status": user_cert.get('status'),
                "is_passing": user_cert.get('is_passing'),
                "download_url": user_cert.get('download_url'),
                "grade": user_cert.get('grade')
            }
        )

class CertificatesListView(GenericAPIView):
    """
        **Use Case**

            * Get the list of a certificate for a specific course_id

        **Example Request**

            GET /api/certificates/v0/certificates/courses/{course_id}

        **GET Parameters**

            A GET request must include the following parameters.

            * course_id: A string representation of a Course ID.

    """

    authentication_classes = (
        authentication.OAuth2AuthenticationAllowInactiveUser,
        authentication.SessionAuthenticationAllowInactiveUser,
        JwtAuthentication,
    )
    permission_classes = (
        IsAuthenticated,
        permissions.IsStaff
    )

    def get(self, request, course_id):
        """
        Gets a certificate information.

        Args:
            request (Request): Django request object.
            course_id (string): URI element specifying the course location.

        Return:
            if application/json
                A JSON serialized representation of the certificate.
            if application/html
                HttpResponse with table
        """
        try:
            course_key = CourseKey.from_string(course_id)
        except InvalidKeyError:
            log.warning('Course ID string "%s" is not valid', course_id)
            return Response(
                status=404,
                data={'error_code': 'course_id_not_valid'}
            )

        course_enrollment_manager = CourseEnrollmentManager()
        students_enrollments_in_course = course_enrollment_manager.users_enrolled_in(
            course_id=course_key, include_inactive=True)

        users_cert = []
        for student in students_enrollments_in_course:
            user_cert = get_certificate_for_user(username=student, course_key=course_key)
            if user_cert is not None:
                users_cert.append({
                    "first_name": user_cert.get('username').first_name,
                    "last_name": user_cert.get('username').last_name,
                    "username": user_cert.get('username').username,
                    "e_mail": user_cert.get('username').email,
                    "course_id": unicode(user_cert.get('course_key')),
                    "certificate_type": user_cert.get('type'),
                    "created_date": user_cert.get('created'),
                    "status": user_cert.get('status'),
                    "is_passing": user_cert.get('is_passing'),
                    "download_url": user_cert.get('download_url'),
                    "grade": user_cert.get('grade')
                })

        # temporary used. it will be removed, when application/json will be implemented in instructor_dashboard
        if 'text/html' in request.META.get('HTTP_ACCEPT', 'text/html'):
            html = ['<table>']
            html.append('''<tr><th>Lp.</th><th>first_name</th><th>last_name</th><th>username</th>
                            <th>e-mail</th><th>created_date</th></tr>''')
            n=0
            for user_cert in users_cert:
                n += 1
                html.append('<tr>')
                html.append('<td>{}</td><td>{}</td><td>{}</td><td>{}</td><td>{}</td><td>{}</td>'.format(
                    n, user_cert['first_name'],user_cert['last_name'], user_cert['username'],
                    user_cert['e_mail'],user_cert['created_date']))
                html.append('</tr>')
            html.append('</table>')
            return HttpResponse(''.join(html))

        # TO DO: add pagination
        elif "application/json" in request.META.get('HTTP_ACCEPT'):
            return Response(users_cert)

