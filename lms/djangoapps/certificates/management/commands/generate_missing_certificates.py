from logging import getLogger
from xmodule.modulestore.django import modulestore
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
logger = getLogger(__name__)


class Command(BaseCommand):

    def handle(self, *args, **options):

        """
            Generate a certificate for students who have successfully completed the entire course.
            This option only works if the 'certificates_generate_daily' option in the advanced settings of the course is enabled.

            This cronjob should be every six hours
            """

        for course in modulestore().get_courses():
            if course.certificates_generate_daily:
                course_id = unicode(course.id)

                logger.info('[GENERATE CERTS] starting generating for {}'.format(course_id))

                args = '-c {}'.format(course_id)
                call_command('ungenerated_certs', *args.split(' '))
