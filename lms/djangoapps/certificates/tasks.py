from celery import task
from logging import getLogger

from celery_utils.persist_on_failure import LoggedPersistOnFailureTask
from django.contrib.auth.models import User
from lms.djangoapps.verify_student.services import IDVerificationService
from opaque_keys.edx.keys import CourseKey
from xmodule.modulestore.django import modulestore
from django.core.management import call_command

from .api import generate_user_certificates

logger = getLogger(__name__)


@task(base=LoggedPersistOnFailureTask, bind=True, default_retry_delay=30, max_retries=2)
def generate_certificate(self, **kwargs):
    """
    Generates a certificate for a single user.

    kwargs:
        - student: The student for whom to generate a certificate.
        - course_key: The course key for the course that the student is
            receiving a certificate in.
        - expected_verification_status: The expected verification status
            for the user.  When the status has changed, we double check
            that the actual verification status is as expected before
            generating a certificate, in the off chance that the database
            has not yet updated with the user's new verification status.
    """
    original_kwargs = kwargs.copy()
    student = User.objects.get(id=kwargs.pop('student'))
    course_key = CourseKey.from_string(kwargs.pop('course_key'))
    expected_verification_status = kwargs.pop('expected_verification_status', None)
    if expected_verification_status:
        actual_verification_status = IDVerificationService.user_status(student)
        if expected_verification_status != actual_verification_status:
            raise self.retry(kwargs=original_kwargs)
    generate_user_certificates(student=student, course_key=course_key, **kwargs)


@task()
def generate_missing_certificates():
    """
    Generate a certificate for students who have successfully completed the entire course.
    This option only works if the 'certificates_generate_daily' option in the advanced settings of the course is enabled.

    This task should be run once a day at night
    """

    for course in modulestore().get_courses():
        if course.certificates_generate_daily:
            course_id = unicode(course.id)

            logger.info('[GENERATE CERTS] starting generating for {}'.format(course_id))

            args = '-c {}'.format(course_id)
            call_command('ungenerated_certs', *args.split(' '))
