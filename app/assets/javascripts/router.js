'use strict';

(function(root) {

  root.App = root.App || {};

  root.App.Router = Backbone.Router.extend({

    routes: {
      '(?tags[]=:tag)': 'landing',
      'case-studies/:id(?page=:page)': 'caseStudies'
    },

    initialize: function() {
      this.setListeners();
    },

    setListeners: function() {
      this.listenTo(this, 'route:updateParam', this.updateParam);
    },

    /**
     * Starts the router navigation
     */
    start: function() {
      Backbone.history.start({ pushState: true });
    },

    /**
     * Updates the url with the params
     * @param {Object} params Parameters for the url
     */
    updateParam: function(params) {
      console.log('updating: '+ params);
      var current = window.location.pathname;

      if (params && params.name && params.value) {
        this.navigate(current + '?'+ params.name + '=' + params.value, {
          trigger: false, replace: true
        });
      } else {
        this.navigate(current, {
          trigger: false, replace: true
        });
      }

      this.trigger('rooter:updated', params.value);
    },

    /**
     * Router for Landing
     */
    landing: function(tag) {
      tag = tag || false;
      this.trigger('start:landing', tag);
    },

    /**
     * Router for Case Studies
     */
    caseStudies: function(id, page) {
      page = page || 0;
      this.trigger('start:slider', page);
    }

  });

})(window);
