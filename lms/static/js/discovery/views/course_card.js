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

            tagName: 'div',
            templateId: '#course_card-tpl',
            className: 'col-lg-4 mb-2',

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
