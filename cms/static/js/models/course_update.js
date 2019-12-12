define(['backbone', 'jquery', 'jquery.ui'], function(Backbone, $) {
    // course update -- biggest kludge here is the lack of a real id to map updates to originals
    var CourseUpdate = Backbone.Model.extend({
        defaults: {
            date: $.datepicker.formatDate('MM d, yy', new Date()),
            content: '',
            push_notification_enabled: false,
            push_notification_selected: false
        },
        validate: function(attrs) {
            var date_exists = (attrs.date !== null && attrs.date !== '');
            var date_is_valid_string = ($.datepicker.formatDate('dd/mm/yy', parseDateFromString(attrs.date)) === attrs.date);
            if (!(date_exists && date_is_valid_string)) {
                return {date_required: gettext('Action required: Enter a valid date.')};
            }
        }
    });

    var parseDateFromString = function(stringDate) {
        if (stringDate && typeof stringDate === 'string') {
            var parts = stringDate.split('/');
            return new Date(parts[2], parts[1]-1, parts[0]);
        } else {
            return stringDate;
        }
    };

    return CourseUpdate;
}); // end define()
