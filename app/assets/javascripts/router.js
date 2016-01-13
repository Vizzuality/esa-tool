'use strict';

(function(root) {

  root.App = root.App || {};

  root.App.Router = Backbone.Router.extend({

    routes: {
      'case-studies/:id?page=:page': 'caseStudies'
    },

    initialize: function() {
      this.setListeners();
    },

    setListeners: function() {
      this.listenTo(this, 'route:update', this.updateParams);
    },

    /**
     * Starts the router navigation
     */
    start: function() {
      Backbone.history.start({ pushState: true });
    },

    /**
     * Updates the url with the params
     * @param {Object} params Parameters for th url
     */
    updateParams: function(params) {
      var current = window.location.pathname;
      
      if (params && params.page) {
        this.navigate(current + '?page=' + params.page, {
          trigger: false, replace: true
        });
      }
    },

    /**
     * Router for Case Studies
     */
    caseStudies: function(id, page) {
      this.trigger('update:slider', page);
    }

  });

})(window);