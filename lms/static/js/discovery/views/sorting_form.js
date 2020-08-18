(function (define) {
    define(['jquery', 'backbone', 'gettext'], function ($, Backbone, gettext) {
        'use strict';

        return Backbone.View.extend({

            el: '#sorting-form',
            events: {
                'change select': 'sortListOption',
            },

            initialize: function () {
                this.$searchField = this.$el.find('input');
                this.$searchButton = this.$el.find('button');
                this.$message = this.$el.find('.js-discovery-message');
                this.$loadingIndicator = this.$el.find('#loading-indicator');
            },

            sortListOption: function (event) {
                var $target = $(event.currentTarget);
                $target = $target.find('option:selected');
                this.trigger(
                    'sortListOption',
                    $target.val()
                );
            },

            doSort: function () {
            },

        });
    });
}(define || RequireJS.define));
