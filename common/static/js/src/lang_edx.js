var Language = (function() {
    'use strict';
    var $settingsLanguageSelector, $settingsLanguageButtons,
        self = null;
    return {
        init: function() {
            $settingsLanguageSelector = $('#settings-language-value');
            $settingsLanguageButtons = $('.language-button');
            self = this;
            this.listenForLanguagePreferenceChange();
        },

        /**
         * Listener on changing language from selector.
         * Send an ajax request to save user language preferences.
         */
        listenForLanguagePreferenceChange: function() {
            if ($settingsLanguageButtons.length) {
                $settingsLanguageButtons.click(function(event) {
                    var language = $(this).data('lang'),
                        url = $('.url-endpoint').val(),
                        isUserAuthenticated = JSON.parse($('.url-endpoint').data('user-is-authenticated'));
                    $("[name='language']").val(language);
                    event.preventDefault();
                    self.submitAjaxRequest(language, url, function() {
                        if (isUserAuthenticated) {
                            // User language preference has been set successfully
                            // Now submit the form in success callback.
                            $('#language-settings-form').submit();
                        } else {
                            self.refresh();
                        }
                    });
                });
            } else {
                $settingsLanguageSelector.change(function(event) {
                    var language = this.value,
                        url = $('.url-endpoint').val(),
                        isUserAuthenticated = JSON.parse($('.url-endpoint').data('user-is-authenticated'));
                    event.preventDefault();
                    self.submitAjaxRequest(language, url, function() {
                        if (isUserAuthenticated) {
                            // User language preference has been set successfully
                            // Now submit the form in success callback.
                            $('#language-settings-form').submit();
                        } else {
                            self.refresh();
                        }
                    });
                });
            }
        },
        /**
         * Send an ajax request to set user language preferences.
         */
        submitAjaxRequest: function(language, url, callback) {
            $.ajax({
                type: 'PATCH',
                data: JSON.stringify({'pref-lang': language}),
                url: url,
                dataType: 'json',
                contentType: 'application/merge-patch+json',
                notifyOnError: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
                }
            }).done(function() {
                callback();
            }).fail(function() {
                self.refresh();
            });
        },

        /**
         * refresh the page.
         */
        refresh: function() {
            // reloading the page so we can get the latest state of released languages from model
            location.reload();
        }

    };
}());
$(document).ready(function() {
    'use strict';
    Language.init();
});
