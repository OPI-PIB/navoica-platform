from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from openedx.core.djangoapps.content.course_overviews.models import \
    CourseOverview
from openedx.features.course_experience import course_home_url_name


class CourseOverviewSitemap(Sitemap):
    changefreq = "weekly"
    priority = 1.0

    def items(self):
        return CourseOverview.objects.all()

    def lastmod(self, obj):
        return obj.modified

    def location(self, obj):
        return reverse(course_home_url_name(obj.id), args=[unicode(obj.id)])
