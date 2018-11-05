""" Overrides for Docker-based devstack. """

from .devstack import *  # pylint: disable=wildcard-import, unused-wildcard-import

# Docker does not support the syslog socket at /dev/log. Rely on the console.
LOGGING['handlers']['local'] = LOGGING['handlers']['tracking'] = {
    'class': 'logging.NullHandler',
}

PLATFORM_NAME = 'Polski MOOC Draft'
LOGGING['loggers']['tracking']['handlers'] = ['console']
HOMEPAGE_COURSE_MAX = 4
LMS_BASE = os.environ.get('LMS_BASE', 'polskimooc-test.opi.org.pl')
CMS_BASE = 'studio.'+LMS_BASE
SITE_NAME = LMS_BASE
LMS_ROOT_URL = 'http://{}'.format(LMS_BASE)
LMS_INTERNAL_ROOT_URL = LMS_ROOT_URL

ECOMMERCE_PUBLIC_URL_ROOT = 'http://localhost:18130'
ECOMMERCE_API_URL = 'http://%s:18130/api/v2' % LMS_BASE

#COMMENTS_SERVICE_URL = 'http://edx-dev.opi.org.pl:4567'

ENTERPRISE_API_URL = '{}/enterprise/api/v1/'.format(LMS_INTERNAL_ROOT_URL)

CREDENTIALS_INTERNAL_SERVICE_URL = 'http://%s:18150' % LMS_BASE
CREDENTIALS_PUBLIC_SERVICE_URL = 'http://localhost:18150'

OAUTH_OIDC_ISSUER = '{}/oauth2'.format(LMS_ROOT_URL)
TIME_ZONE = 'Europe/Warsaw'
JWT_AUTH.update({
    'JWT_SECRET_KEY': 'lms-secret',
    'JWT_ISSUER': OAUTH_OIDC_ISSUER,
    'JWT_AUDIENCE': 'lms-key',
})

FEATURES.update({
    'AUTOMATIC_AUTH_FOR_TESTING': True,
    'ENABLE_COURSEWARE_SEARCH': True,
    'ENABLE_COURSE_DISCOVERY': True,
    'ENABLE_DASHBOARD_SEARCH': False,
    'ENABLE_DISCUSSION_SERVICE': True,
    'SHOW_HEADER_LANGUAGE_SELECTOR': True,
    'ENABLE_ENTERPRISE_INTEGRATION': False,
})

ENABLE_MKTG_SITE = os.environ.get('ENABLE_MARKETING_SITE', False)
MARKETING_SITE_ROOT = os.environ.get('MARKETING_SITE_ROOT', 'http://localhost:8080')

MKTG_URLS = {
    'ABOUT': '/about',
    'ACCESSIBILITY': '/accessibility',
    'AFFILIATES': '/affiliate-program',
    'BLOG': '/blog',
    'CAREERS': '/careers',
    'CONTACT': '/support/contact_us',
    'COURSES': '/course',
    'DONATE': '/donate',
    'ENTERPRISE': '/enterprise',
    'FAQ': '/student-faq',
    'HONOR': '/edx-terms-service',
    'HOW_IT_WORKS': '/how-it-works',
    'MEDIA_KIT': '/media-kit',
    'NEWS': '/news-announcements',
    'PRESS': '/press',
    'PRIVACY': '/edx-privacy-policy',
    'ROOT': MARKETING_SITE_ROOT,
    'SCHOOLS': '/schools-partners',
    'SITE_MAP': '/sitemap',
    'TRADEMARKS': '/trademarks',
    'TOS': '/edx-terms-service',
    'TOS_AND_HONOR': '/edx-terms-service',
    'WHAT_IS_VERIFIED_CERT': '/verified-certificate',
}

CREDENTIALS_SERVICE_USERNAME = 'credentials_worker'

COURSE_CATALOG_API_URL = 'http://localhost:18381/api/v1/'

LANGUAGE_CODE = 'pl'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = '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'

DEFAULT_FROM_EMAIL = 'registration@'+LMS_BASE
DEFAULT_FEEDBACK_EMAIL = 'feedback@'+LMS_BASE
SERVER_EMAIL = 'devops@'+LMS_BASE
