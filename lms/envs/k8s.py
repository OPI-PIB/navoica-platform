from logging.handlers import SysLogHandler

from .aws import *

LOGGING['handlers']['local'] = {
    'level': 'INFO',
    'class': 'logging.handlers.SysLogHandler',
    'address': ENV_TOKENS.get('SYSLOG_ADDRESS', '/dev/log'),
    'formatter': 'syslog_format',
    'facility': SysLogHandler.LOG_LOCAL0,
}

LOGGING['handlers']['tracking'] = {
    'level': 'DEBUG',
    'class': 'logging.handlers.SysLogHandler',
    'address': ENV_TOKENS.get('SYSLOG_ADDRESS', '/dev/log'),
    'facility': SysLogHandler.LOG_LOCAL1,
    'formatter': 'raw',
}
