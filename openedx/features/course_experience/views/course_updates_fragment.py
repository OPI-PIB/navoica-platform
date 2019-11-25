"""
View logic for handling latest course updates.

Although the welcome message fragment also displays the latest update,
this fragment dismisses the message for a limited time so new updates
will continue to appear, where the welcome message gets permanently
dismissed.
"""
from django.template.loader import render_to_string
from opaque_keys.edx.keys import CourseKey
from web_fragments.fragment import Fragment

from courseware.courses import get_course_with_access
from openedx.core.djangoapps.plugin_api.views import EdxFragmentView
from openedx.features.course_experience.views.course_updates import get_ordered_updates

class UpdatesFragmentView(EdxFragmentView):
    """
    A fragment that displays the latest course update.
    """

    def render_to_fragment(self, request, course_id=None, **kwargs):
        """
        Renders the latest update message fragment for the specified course.

        Returns: A fragment, or None if there is no latest update message.
        """
        course_key = CourseKey.from_string(course_id)
        course = get_course_with_access(request.user, 'load', course_key, check_if_enrolled=True)

        ordered_updates = get_ordered_updates(request, course)

        if not ordered_updates:
            return None

        context = {
            'ordered_updates': ordered_updates,
        }
        html = render_to_string('course_experience/updates-fragment.html', context)
        return Fragment(html)

