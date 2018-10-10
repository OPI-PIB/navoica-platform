(function(define) {
    define([
        'jquery',
        'underscore',
        'backbone',
        'gettext',
        'edx-ui-toolkit/js/utils/date-utils'
    ], function($, _, Backbone, gettext, DateUtils) {
        'use strict';

        function formatDate(date, userLanguage, userTimezone) {
            var context;
            context = {
                datetime: date,
                language: userLanguage,
                timezone: userTimezone,
                format: DateUtils.dateFormatEnum.shortDate
            };
            return DateUtils.localize(context);
        }

        return Backbone.View.extend({

            tagName: 'li',
            templateId: '#course_card-tpl',
            className: 'col-md-6 col-xl-4',

            initialize: function() {
                this.tpl = _.template($(this.templateId).html());
            },

            render: function() {
                var data = _.clone(this.model.attributes);

                data['org_text'] = data['org'];
                if (data['organizer']!==undefined){
                    data['org_text'] = "organizer_"+data['organizer']
                }

                var userLanguage = 'pl',
                    userTimezone = 'Europe/Warsaw';
                if (this.model.userPreferences !== undefined) {
                    userLanguage = this.model.userPreferences.userLanguage || 'pl';
                    userTimezone = this.model.userPreferences.userTimezone || 'Europe/Warsaw';
                }
                if (data.advertised_start !== undefined) {
                    data.start = data.advertised_start;
                } else {
                    data.start = formatDate(
                        new Date(data.start),
                        userLanguage,
                        userTimezone
                    );
                }
                data.enrollment_start = formatDate(
                    new Date(data.enrollment_start),
                    userLanguage,
                    userTimezone
                );
                this.$el.html(this.tpl(data));
                return this;
            }

        });
    });
}(define || RequireJS.define));
