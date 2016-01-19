'use strict';

(function(App) {

  App.Collection = App.Collection || {};

  App.Collection.CaseStudyCollection = Backbone.Collection.extend({

    url: '/case-studies'

  });

})(window.App || {});
