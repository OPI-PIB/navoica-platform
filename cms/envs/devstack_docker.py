""" Overrides for Docker-based devstack. """

from .devstack import *  # pylint: disable=wildcard-import, unused-wildcard-import

# Docker does not support the syslog socket at /dev/log. Rely on the console.
LOGGING['handlers']['local'] = LOGGING['handlers']['tracking'] = {
    'class': 'logging.NullHandler',
}

LOGGING['loggers']['tracking']['handlers'] = ['console']

LMS_BASE = os.environ.get('LMS_BASE', 'draft.navoica.pl')
CMS_BASE = os.environ.get('CMS_BASE', 'studio-'+LMS_BASE)
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

DEFAULT_FROM_EMAIL = 'registration@'+LMS_BASE
DEFAULT_FEEDBACK_EMAIL = 'feedback@'+LMS_BASE
SERVER_EMAIL = 'devops@'+LMS_BASE

SETTINGS_EXPORT = [
    'PLATFORM_NAME',
    'LMS_ROOT_URL',
    'STUDIO_NAME',
    'FAVICON_PATH',
]

WIKI_ENABLED = False
