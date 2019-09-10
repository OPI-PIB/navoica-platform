""" Overrides for Docker-based devstack. """

from .devstack import *  # pylint: disable=wildcard-import, unused-wildcard-import

# Docker does not support the syslog socket at /dev/log. Rely on the console.
LOGGING['handlers']['local'] = LOGGING['handlers']['tracking'] = {
    'class': 'logging.NullHandler',
}

LOGGING['loggers']['tracking']['handlers'] = ['console']

LMS_BASE = 'draft.navoica.pl'
CMS_BASE = 'studio-draft.navoica.pl'
LMS_ROOT_URL = 'http://{}'.format(LMS_BASE)

FEATURES.update({
    'ENABLE_COURSEWARE_INDEX': True,
    'ENABLE_LIBRARY_INDEX': True,
    'ENABLE_DISCUSSION_SERVICE': True,
    'ENABLE_CREATOR_GROUP': True,
})

CREDENTIALS_SERVICE_USERNAME = 'credentials_worker'

OAUTH_OIDC_ISSUER = '{}/oauth2'.format(LMS_ROOT_URL)

JWT_AUTH.update({
    'JWT_SECRET_KEY': 'lms-secret',
    'JWT_ISSUER': OAUTH_OIDC_ISSUER,
    'JWT_AUDIENCE': 'lms-key',
})
TIME_ZONE = 'Europe/Warsaw'
LANGUAGE_CODE = 'pl'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = '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'

DEFAULT_FROM_EMAIL = 'registration@navoica.pl'
DEFAULT_FEEDBACK_EMAIL = 'feedback@navoica.pl'
SERVER_EMAIL = 'devops@navoica.pl'

COURSE_DISCOVERY_FACETS = ['difficulty', 'availability', 'status', 'key']
