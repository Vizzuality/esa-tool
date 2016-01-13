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
      this.template = this.options.template;
      this.elContent = this.options.elContent;

      this._initMap();
    },

    /**
     * Initializes the map
     */
    _initMap: function() {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      var parent = this.elContent;
      var mapEl = parent.querySelector('#mapView');
      var basemapEl = parent.querySelector('#basemapView');

      this.map = new App.View.Map({ 
        el: mapEl,
        template: this.template
      });

      this.mapBasemap = new App.View.MapBasemap({
        el: basemapEl
      })

      this.listenTo(this.mapBasemap, 'basemap:set', this.setBase);
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
