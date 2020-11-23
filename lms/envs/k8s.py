import os
from logging.handlers import SysLogHandler

from .aws import *

LOGGING['handlers']['local'] = {
    'level': 'INFO',
    'class': 'logging.StreamHandler',
}

LOGGING['handlers']['tracking'] = {
    'level': 'DEBUG',
    'class': 'logging.handlers.SysLogHandler',
    'address': ('edx-syslog', 514),
    'facility': SysLogHandler.LOG_LOCAL0,
    'formatter': 'raw',
}

PLATFORM_VERSION = os.environ['BUILD_TAG']