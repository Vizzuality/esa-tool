'use strict';

/**
 * Map controller
 * @param  {Object} App Global object
 */
(function(App) {

  App.Controller = App.Controller || {};

  App.Controller.Map = Backbone.View.extend({

    defaults: {
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.elContent = this.options.elContent;
      this.data = this.options.data;
      this.page = this.options.page;

      this._initMap();
    },

    /**
     * Initializes the map
     */
    _initMap: function() {
      var parent = this.elContent;
      var mapEl = parent.querySelector('#mapView');
      var basemapEl = parent.querySelector('#basemapView');
      var mapData = this._getData();

      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      this.map = new App.View.Map({ 
        el: mapEl,
        data: mapData
      });

      this.mapBasemap = new App.View.MapBasemap({
        el: basemapEl
      })

      this.listenTo(this.mapBasemap, 'basemap:set', this.setBase);
    },

    /**
     * Gets the needed data to pass it to the map view 
    */
    _getData: function() {
      var data = {};

      if (this.data) {
        var caseStudy = this.data.case_study;
        data.cartoUser = this.data.cartodb_user;

        if (caseStudy) {
          var pages = caseStudy.pages;
          data.template = caseStudy.template;
          
          if (pages) {
            var page = pages[this.page - 1];

            if (page) {
              data.layer = page.data_layer;
            }
          }
        }
      }
      return data;
    },

    /** 
     * Removes the map and basemap view and the listening events.
     */
    remove: function() {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      if (this.mapBasemap) {
        this.mapBasemap.remove();
        this.mapBasemap = null;
      }

      this.stopListening();
    },

    /**
     * Sets the basemap value from the basemap selector
     * in the map's view
    */
    setBase: function(base) {
      this.map.setBasemap(base);
    }

  });

})(window.App || {});
