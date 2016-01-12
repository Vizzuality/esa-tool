'use strict';

/**
 * Map View contains the Leaflet map
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Map = Backbone.View.extend({

    events: {
      'click .basemap': '_toggleBasemap',
      'click .basemap .item': '_selectBasemap'
    },

    defaults: {
      center: [46, 20],
      scrollWheelZoom: false,
      zoom: 5,
      basemap: 'terrain'
    },

    /**
    * Basemaps attributions
    */
    attributions: {
      'cartodb': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      'mapbox': '&copy; <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },

    /** 
    * Basemaps dictionary by themes id
    */
    basemaps: {
      1: {
        terrain: {
          tileUrl: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          attribution: 'cartodb'
        },
        satellite: {
          tileUrl: 'https://api.mapbox.com/v4/geriux.om6jab39/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VyaXV4IiwiYSI6IkFYS1ZJdDgifQ.Md25z-4Qp3qtodl4kjTrZQ',
          attribution: 'mapbox'
        }
      },
      2: {
        terrain: {
          tileUrl: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          attribution: 'mapbox'
        },
        satellite: {
          tileUrl: 'https://api.mapbox.com/v4/geriux.om6jab39/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VyaXV4IiwiYSI6IkFYS1ZJdDgifQ.Md25z-4Qp3qtodl4kjTrZQ',
          attribution: 'mapbox'
        }
      },
      3: {
        terrain: {
          tileUrl: 'https://api.mapbox.com/v4/alexdontsurf.fa9a7462/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWxleGRvbnRzdXJmIiwiYSI6IlU5MWZ4TU0ifQ.Ro2ZkpiiUpzhResB5Lr04A',
          attribution: 'mapbox'
        },
        satellite: {
          tileUrl: 'https://api.mapbox.com/v4/geriux.om6jab39/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VyaXV4IiwiYSI6IkFYS1ZJdDgifQ.Md25z-4Qp3qtodl4kjTrZQ',
          attribution: 'mapbox'
        }
      },
      4: {
        terrain: {
          tileUrl: 'https://api.mapbox.com/v4/elena3558.2fb60408/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZWxlbmEzNTU4IiwiYSI6ImNpaWhndnczMzAwMHN2eGtzYmJzejVkYzQifQ.2rBSYnizcEVl8nko6Fry6g',
          attribution: 'mapbox'
        },
        satellite: {
          tileUrl: 'https://api.mapbox.com/v4/geriux.om6jab39/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VyaXV4IiwiYSI6IkFYS1ZJdDgifQ.Md25z-4Qp3qtodl4kjTrZQ',
          attribution: 'mapbox'
        }
      }
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.template = this.options.template;
      this.elMap = this.options.elMap;

      // At beginning create the map
      this.createMap();
      this._setListeners();
    },

    /**
     * Function to set events at beginning
     */
    _setListeners: function() {
      var refreshLayout = _.debounce(_.bind(this.refresh, this), 500);
      window.addEventListener('resize', refreshLayout, false);
    },

    /**
     * Init the Leaflet map and add basemap
     */
    createMap: function() {
      if (!this.map) {
        this.map = L.map(this.elMap, this.options);
        this.setBasemap(this.defaults.basemap);
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
     * Re-render the map
     */
    refresh: function() {
      this.map.invalidateSize();
    },

    /**
     * Set a basemap
     * @param {String} type of basemap terrain | satellite
     */
    setBasemap: function(type) {
      var tile = this.basemaps[this.template];
      var attribution = tile[type].attribution;
      var attributionUrl = this.attributions[attribution];

      if (this.tileLayer) {
        this.map.removeLayer(this.tileLayer);
        this.tileLayer = null;
      }

      if (tile) {
        this.tileLayer = L.tileLayer(tile[type].tileUrl, {
          attribution: attributionUrl
        }).addTo(this.map);
      }
    },

    /**
     * Toggles the basemap menu
     * @param {Event} 
     */
    _toggleBasemap: function(ev) {
      var elem = ev.currentTarget;
      elem.classList.toggle('active');
    },

    /**
     * Selects a basemap from the menu
     * @param {Event} 
     */
    _selectBasemap: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var elem = ev.currentTarget;
      var selectedValue = elem.getAttribute('data-value');
      var previousSelected = document.querySelector('.basemap .selected');
      
      previousSelected.classList.remove('selected');
      elem.classList.add('selected');

      this.setBasemap(selectedValue);
    }

  });

})(window.App || {});
