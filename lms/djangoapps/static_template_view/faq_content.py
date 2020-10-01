from django.utils.translation import ugettext as _


faq_content = [
    # O platformie
    {
        "name": _("FAQ_Category1"),
        "icon_class": "fas fa-university",  #TODO fas fa-book-reader - upgrade fa version 5
        "questions": [
            (_("FAQ_Question1.1"), _("FAQ_Answer1.1")),
            (_("FAQ_Question1.2"), _("FAQ_Answer1.2")),
            (_("FAQ_Question1.3"), _("FAQ_Answer1.3")),
            (_("FAQ_Question1.4"), _("FAQ_Answer1.4")),
        ],
    }, {
        # Kursy
        "name": _("FAQ_Category2"),
        "icon_class": "fas fa-graduation-cap",
        "questions": [
            (_("FAQ_Question2.1"), _("FAQ_Answer2.1")),
            (_("FAQ_Question2.2"), _("FAQ_Answer2.2")),
            (_("FAQ_Question2.3"), _("FAQ_Answer2.3")),
            (_("FAQ_Question2.4"), _("FAQ_Answer2.4")),
            (_("FAQ_Question2.5"), _("FAQ_Answer2.5")),
            (_("FAQ_Question2.6"), _("FAQ_Answer2.6")),
            (_("FAQ_Question2.7"), _("FAQ_Answer2.7")),
            (_("FAQ_Question2.8"), _("FAQ_Answer2.8")),
            (_("FAQ_Question2.9"), _("FAQ_Answer2.9")),
            (_("FAQ_Question2.10"), _("FAQ_Answer2.10")),
            (_("FAQ_Question2.11"), _("FAQ_Answer2.11")),
            (_("FAQ_Question2.12"), _("FAQ_Answer2.12")),
            (_("FAQ_Question2.13"), _("FAQ_Answer2.13")),
        ],
    }, {
        # problemy techniczne
        "name": _("FAQ_Category3"),
        "icon_class": "fas fa-bug",
        "questions": [
            (_("FAQ_Question3.1"), _("FAQ_Answer3.1")),
            (_("FAQ_Question3.2"), _("FAQ_Answer3.2")),
            (_("FAQ_Question3.3"), _("FAQ_Answer3.3")),
            (_("FAQ_Question3.4"), _("FAQ_Answer3.4")),
        ]
    }, {
        # zaswiadczenia
        "name": _("FAQ_Category4"),
        "icon_class": "fas fa-award",
        "questions": [
            (_("FAQ_Question4.1"), _("FAQ_Answer4.1")),
            (_("FAQ_Question4.2"), _("FAQ_Answer4.2")),
            (_("FAQ_Question4.3"), _("FAQ_Answer4.3")),
            (_("FAQ_Question4.4"), _("FAQ_Answer4.4")),
            (_("FAQ_Question4.5"), _("FAQ_Answer4.5")),
        ]
    }, {
        # konto
        "name": _("FAQ_Category5"),
        "icon_class": "far fa-id-badge",
        "questions": [
            (_("FAQ_Question5.1"), _("FAQ_Answer5.1")),
        ]
    }, {
        # kontakt
        "name": _("FAQ_Category6"),
        "icon_class": "far fa-envelope",
        "questions": [
            (_("FAQ_Question6.1"), _("FAQ_Answer6.1")),
            (_("FAQ_Question6.2"), _("FAQ_Answer6.2")),
        ]
    },
]
