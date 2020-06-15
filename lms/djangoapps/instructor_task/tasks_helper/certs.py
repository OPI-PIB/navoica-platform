"""
Instructor tasks related to certificates.
"""
from time import time

from django.contrib.auth.models import User
from django.db.models import Q
import requests
import os

from lms.djangoapps.certificates.api import generate_user_certificates
from lms.djangoapps.certificates.models import \
    CertificateGenerationMergeHistory, CertificateStatuses, GeneratedCertificate
from student.models import CourseEnrollment
from xmodule.modulestore.django import modulestore
from django.contrib.auth.models import AnonymousUser
from shutil import make_archive
from django.core.files.base import ContentFile

from openedx.core.djangoapps.certificates.api import \
    certificates_viewable_for_course
from .runner import TaskProgress
from ..models import InstructorTask
from ... import instructor_task


def generate_students_certificates(
        _xmodule_instance_args, _entry_id, course_id, task_input, action_name):

    start_time = time()
    students_to_generate_certs_for = CourseEnrollment.objects.users_enrolled_in(course_id)

    student_set = task_input.get('student_set')
    if student_set == 'all_whitelisted':
        # Generate Certificates for all white listed students.
        students_to_generate_certs_for = students_to_generate_certs_for.filter(
            certificatewhitelist__course_id=course_id,
            certificatewhitelist__whitelist=True
        )

    elif student_set == 'whitelisted_not_generated':
        # Whitelist students who did not get certificates already.
        students_to_generate_certs_for = students_to_generate_certs_for.filter(
            certificatewhitelist__course_id=course_id,
            certificatewhitelist__whitelist=True
        ).exclude(
            generatedcertificate__course_id=course_id,
            generatedcertificate__status__in=CertificateStatuses.PASSED_STATUSES
        )

    elif student_set == "specific_student":
        specific_student_id = task_input.get('specific_student_id')
        students_to_generate_certs_for = students_to_generate_certs_for.filter(id=specific_student_id)

    task_progress = TaskProgress(action_name, students_to_generate_certs_for.count(), start_time)

    current_step = {'step': 'Calculating students already have certificates'}
    task_progress.update_task_state(extra_meta=current_step)

    statuses_to_regenerate = task_input.get('statuses_to_regenerate', [])
    if student_set is not None and not statuses_to_regenerate:
        # We want to skip 'filtering students' only when students are given and statuses to regenerate are not
        students_require_certs = students_to_generate_certs_for
    else:
        students_require_certs = students_require_certificate(
            course_id, students_to_generate_certs_for, statuses_to_regenerate
        )

    if statuses_to_regenerate:
        # Mark existing generated certificates as 'unavailable' before regenerating
        # We need to call this method after "students_require_certificate" otherwise "students_require_certificate"
        # would return no results.
        invalidate_generated_certificates(course_id, students_to_generate_certs_for, statuses_to_regenerate)

    task_progress.skipped = task_progress.total - len(students_require_certs)

    current_step = {'step': 'Generating Certificates'}
    task_progress.update_task_state(extra_meta=current_step)

    course = modulestore().get_course(course_id, depth=0)
    # Generate certificate for each student
    for student in students_require_certs:
        task_progress.attempted += 1
        status = generate_user_certificates(
            student,
            course_id,
            course=course
        )

        if CertificateStatuses.is_passing_status(status):
            task_progress.succeeded += 1
        else:
            task_progress.failed += 1

    return task_progress.update_task_state(extra_meta=current_step)

def merging_all_course_certificates(
        _xmodule_instance_args, _entry_id, course_id, task_input, action_name):
    from lms.djangoapps.certificates.views import render_cert_by_uuid
    from django.test.client import RequestFactory

    start_time = time()

    certificates = GeneratedCertificate.eligible_certificates.filter(
        status=CertificateStatuses.downloadable,
        course_id=course_id
    )

    task_progress = TaskProgress(action_name, certificates.count(), start_time)

    current_step = {'step': 'Generating Certificates'}
    task_progress.update_task_state(extra_meta=current_step)

    base_tmp = "/tmp/certificates/"
    path_tmp = base_tmp+str(course_id)+"/"
    try:
        os.makedirs(path_tmp)
    except OSError:
        pass

    factory = RequestFactory()
    fake_request = factory.get("")
    fake_request.user = AnonymousUser()
    fake_request.session = {}

    # Generate certificate for each student
    for certificate in certificates:
        task_progress.attempted += 1

        output = render_cert_by_uuid(fake_request, certificate.verify_uuid)

        multipart_form_data = {
            'file': ('index.html', output.content),
            'marginTop': (None, '0',),
            'marginBottom': (None, '0',),
            'marginLeft': (None, '0',),
            'marginRight': (None, '0',),
            'landscape': (None, 'true',),
        }

        # $ docker run --rm -p 3000:3000 thecodingmachine/gotenberg:5
        r = requests.post('http://gotenberg:3000/convert/html',
                          files=multipart_form_data)

        with open(path_tmp+certificate.verify_uuid+".pdf", 'wb') as f:
            f.write(r.content)

        current_step = {'step': certificate.verify_uuid}
        task_progress.update_task_state(extra_meta=current_step)

        task_progress.succeeded += 1
        #task_progress.failed += 1

    cert_genereted_history, created = CertificateGenerationMergeHistory.objects.get_or_create(
        instructor_task=InstructorTask.objects.get(task_id=_xmodule_instance_args['task_id']),
    )
    cert_genereted_history.course_id = str(course_id)
    cert_genereted_history.save()

    make_archive(base_tmp+str(course_id),'zip', root_dir=path_tmp,base_dir=None)

    fh = open(base_tmp+str(course_id)+'.zip', "r")
    if fh:
        file_content = ContentFile(fh.read())
        cert_genereted_history.pdf.save(str(course_id)+'.zip', file_content)
        cert_genereted_history.save()

    return task_progress.update_task_state(extra_meta=current_step)

def students_require_certificate(course_id, enrolled_students, statuses_to_regenerate=None):
    """
    Returns list of students where certificates needs to be generated.
    if 'statuses_to_regenerate' is given then return students that have Generated Certificates
    and the generated certificate status lies in 'statuses_to_regenerate'

    if 'statuses_to_regenerate' is not given then return all the enrolled student skipping the ones
    whose certificates have already been generated.

    :param course_id:
    :param enrolled_students:
    :param statuses_to_regenerate:
    """
    if statuses_to_regenerate:
        # Return Students that have Generated Certificates and the generated certificate status
        # lies in 'statuses_to_regenerate'
        students_require_certificates = enrolled_students.filter(
            generatedcertificate__course_id=course_id,
            generatedcertificate__status__in=statuses_to_regenerate
        )
        # Fetch results otherwise subsequent operations on table cause wrong data fetch
        return list(students_require_certificates)
    else:
        # compute those students whose certificates are already generated
        students_already_have_certs = User.objects.filter(
            ~Q(generatedcertificate__status=CertificateStatuses.unavailable),
            generatedcertificate__course_id=course_id)

        # Return all the enrolled student skipping the ones whose certificates have already been generated
        return list(set(enrolled_students) - set(students_already_have_certs))


def invalidate_generated_certificates(course_id, enrolled_students, certificate_statuses):  # pylint: disable=invalid-name
    """
    Invalidate generated certificates for all enrolled students in the given course having status in
    'certificate_statuses'.

    Generated Certificates are invalidated by marking its status 'unavailable' and updating verify_uuid, download_uuid,
    download_url and grade with empty string.

    :param course_id: Course Key for the course whose generated certificates need to be removed
    :param enrolled_students: (queryset or list) students enrolled in the course
    :param certificate_statuses: certificates statuses for whom to remove generated certificate
    """
    certificates = GeneratedCertificate.objects.filter(  # pylint: disable=no-member
        user__in=enrolled_students,
        course_id=course_id,
        status__in=certificate_statuses,
    )

    # Mark generated certificates as 'unavailable' and update download_url, download_uui, verify_uuid and
    # grade with empty string for each row
    certificates.update(
        status=CertificateStatuses.unavailable,
        verify_uuid='',
        download_uuid='',
        download_url='',
        grade='',
    )
