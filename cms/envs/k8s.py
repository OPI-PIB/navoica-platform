from .aws import *
from logging.handlers import SysLogHandler
import os

LOGGING['handlers']['local'] = {
    'level': 'INFO',
    'class': 'logging.StreamHandler',
}

LOGGING['handlers']['tracking'] = {
    'level': 'DEBUG',
    'class': 'logging.handlers.SysLogHandler',
    'address': ('192.168.51.52', 514),
    'facility': SysLogHandler.LOG_LOCAL1,
    'formatter': 'raw',
}


PLATFORM_VERSION = os.environ['BUILD_TAG']