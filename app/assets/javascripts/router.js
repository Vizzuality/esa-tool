'use strict';

(function(root) {

  root.App = root.App || {};

  Backbone.Router.namedParameters = true;

  root.App.Router = Backbone.Router.extend({

    routes: {
      'contact-form': 'landing',
      'cases': 'landing',
      '(?tag=:tag)': 'landing',
      'case-studies/:id(?*queryString)': 'caseStudies',
      'case-studies/:id/preview(?*queryString)': 'caseStudies'
    },

    initialize: function() {
      this.setListeners();
    },

    setListeners: function() {
      this.listenTo(this, 'route:updateParam', this.updateParam);
      Backbone.Events.on('tab:change', this.updateParam.bind(this));
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
    updateParam: function(newParam) {
      var path = window.location.pathname;
      var params = null;
      var query = Object.keys(newParam)[0];

      if (query==='page' || query === 'tag'){
        params = newParam;
      } else {
        params = this._parseQueryParamString(window.location.search.replace('?',''));
        params[query] = newParam[query];
      }

      if (params[query]){
        path = path + '?' + $.param(params);
      }

      this.navigate(path, {
        trigger: false, replace: true
      });

      this.trigger('rooter:updated', params);
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
    caseStudies: function(id, params) {
      params = params ? this._parseQueryParamString(params):{page:0};
      this.trigger('start:case', params);
    },

    _parseQueryParamString: function(queryParams) {
      var result = {};
      queryParams.split('&').forEach(function(param) {
        var item = param.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
      });
      return result;
    }

  });

})(window);
