"""
A new HTML XBlock that is designed with security and embedding in mind.
"""
import bleach


class SanitizedText(object):  # pylint: disable=too-few-public-methods
    """
    This class is responsible for maintaining unsafe string values saved in the database. It returns
    a safe value of the passed text and an unsafe value if requested.
    """

    def __init__(self, value, strict=True):
        """
        This initializer takes a raw value that may contain unsafe content and produce a cleaned version of it. It's
        very helpful to maintain both versions of the content if we need to use it later as a Database field or so.
        :param value: The original string value that came from DB.
        :param strict: Whether to strictly process the given text or not.
        """
        self.strict = strict
        self.sanitized_value = bleach.clean(value,
                                            tags=self._get_allowed_tags(),
                                            attributes=self._get_allowed_attributes(),
                                            styles=self._get_allowed_styles(),
                                            strip=True,
                                            strip_comments=True
                                            )
        self.value = self.sanitized_value

    def _get_allowed_tags(self):
        """
        This is an override to the original bleaching cleaner ALLOWED_TAGS, it deals with two bleaching modes,
        the strict mode, and the trusted mode.

        :return: Allowed tags depending on the bleaching mode
        """
        tags = [
            'a',
            'b',
            'blockquote',
            'code',
            'em',
            'h3',
            'h4',
            'h5',
            'h6',
            'i',
            'img',
            'li',
            'span',
            'strong',
            'pre',
            'ol',
            'ul',
            'p',
            'pre'
        ]

        if not self.strict:
            tags += ['h1', 'h2', 'script', 'sub', 'sup', 'div', 'abbr',
                     'iframe', 'table', 'thead', 'tr', 'th', 'tbody', 'tfoot',
                     'td', 'colgroup', 'col','caption','math','mrow','mn','mo','msup','mfenced','mi','nobr','br']

        return tags

    def _get_allowed_attributes(self):
        """
        This is an override to the original bleaching cleaner ALLOWED_ATTRIBUTES, it deals with two bleaching modes,
        the strict mode, and the trusted mode.

        :return: Allowed attributes depending on the bleaching mode
        """
        attributes = {
            'a': ['href', 'title', 'target', 'rel'],
            'img': ['src', 'alt', 'width', 'height'],
            'p': ['style'],
            'pre': ['class'],
            'span': ['style'],
            'ul': [],
            'th': ['scope'],
            'col': ['span'],
        }

        if not self.strict:
            attributes.update({'abbr': ['title']})

        return attributes

    def _get_allowed_styles(self):
        """
        This is an override to the original bleaching cleaner ALLOWED_STYLES, it deals with two bleaching modes,
        the strict mode, and the trusted mode.

        :return: Allowed styles depending on the bleaching mode
        """
        styles = ['font-family', 'text-align', 'color', 'text-decoration',
                  'padding-left', 'padding-right']

        if not self.strict:
            styles += ['list-style-type', 'font-size', 'border-width', 'margin',
                       'background-color']

        return styles

    def __str__(self):
        """
        :return: The value of the text depending on the strictness level.
        """
        return self.value

    def __unicode__(self):
        """
        :return: The value of the text depending on the strictness level.
        """
        return self.value
