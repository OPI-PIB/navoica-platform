(function(define) {
    define([
        'underscore',
        'backbone',
        'js/discovery/models/course_card',
        'js/discovery/models/facet_option',
        'js/discovery/models/facet_select'
    ], function(_, Backbone, CourseCard, FacetOption) {
        'use strict';

        return Backbone.Model.extend({
            url: '/search/course_discovery/',
            jqhxr: null,

            defaults: {
                totalCount: 0,
                latestCount: 0
            },

            initialize: function(options) {
                var meanings = options.meanings || {};
                var termName = function(facetKey, termKey) {
                return meanings[facetKey] &&
                meanings[facetKey].terms &&
                meanings[facetKey].terms[termKey] || termKey;
                };
                this.courseCards = new Backbone.Collection([], {model: CourseCard});
                this.facetOptions = new Backbone.Collection([], {model: FacetOption, comparator: function(modelA,modelB){
                    var modelA = _.clone(modelA.attributes);
                    var modelB = _.clone(modelB.attributes);
                    modelA.name = termName(modelA.facet, modelA.term);
                    modelB.name = termName(modelB.facet, modelB.term);
                    return modelA.name.localeCompare(modelB.name);
                    } });
            },
            termName: function(facetKey, termKey) {
                return this.meanings[facetKey] &&
                this.meanings[facetKey].terms &&
                this.meanings[facetKey].terms[termKey] || termKey;
            },
            parse: function(response) {
                var courses = response.results || [];
                var facets = response.facets || {};
                this.courseCards.add(_.pluck(courses, 'data'));

                this.set({
                    totalCount: response.total,
                    latestCount: courses.length
                });

                var options = this.facetOptions;
                _(facets).each(function(obj, key) {
                    _(obj.terms).each(function(count, term) {
                        options.add({
                            facet: key,
                            term: term,
                            count: count
                        }, {merge: true});
                    });
                });
            },

            reset: function() {
                this.set({
                    totalCount: 0,
                    latestCount: 0
                });
                this.courseCards.reset();
                this.facetOptions.reset();
            },

            latest: function() {
                return this.courseCards.last(this.get('latestCount'));
            }

        });
    });
}(define || RequireJS.define));
