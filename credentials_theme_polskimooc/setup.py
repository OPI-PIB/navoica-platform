#!/usr/bin/env python
# -*- coding: utf-8 -*-
# pylint: disable=C0111,W6005,W6100from __future__ import absolute_import, print_function

import os
import re
import sys

from setuptools import setup




def get_version(*file_paths):
    """
    Extract the version string from the file at the given relative path fragments.
    """
    filename = os.path.join(os.path.dirname(__file__), *file_paths)
    version_file = open(filename).read()
    version_match = re.search(r"^__version__ = ['\"]([^'\"]*)['\"]", version_file, re.M)
    if version_match:
        return version_match.group(1)
    raise RuntimeError('Unable to find version string.')


VERSION = get_version('polskimooc_theme', '__init__.py')

setup(
    name='credentials_theme_polskimooc',
    version=VERSION,
    description='Themes for the PolskiMOOC Credentials Service',
    packages=[
        'polskimooc_theme',
    ],
    include_package_data=True,
    install_requires=[
        "Django>=1.8"
    ],
    zip_safe=False,
    keywords='Django edx',
)