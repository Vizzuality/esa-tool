'use strict';

/**
 * Map View contains the Leaflet map
 * @param  {Object} App Global object
 */
(function(App) {

  var TILEURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

  App.View = App.View || {};

  App.View.Map = Backbone.View.extend({

    defaults: {
      center: [46, 20],
      scrollWheelZoom: false,
      zoom: 5
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      // At beginning create the map
      this.createMap();
    },

    /**
     * Init the Leaflet map and add basemap
     */
    createMap: function() {
      if (!this.map) {
        this.map = L.map(this.el, this.options);
        window.map = this.map;
        this.setBasemap(TILEURL);
      }
    },

    /**
     * Remove initialized map
     */
    removeMap: function() {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
    },

    /**
     * Remove initialized map and clear the view
     * @return {[type]} [description]
     */
    remove: function() {
      this.removeMap();
      this.$el.html(null);
    },

    /**
     * Set a basemap
     * @param {String} tileUrl http://{s}.tile.osm.org/{z}/{x}/{y}.png
     */
    setBasemap: function(tileUrl) {
      L.tileLayer(tileUrl).addTo(this.map);
    }

  });

})(window.App || {});
