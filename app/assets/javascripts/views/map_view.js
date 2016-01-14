'use strict';

/**
 * Map View contains the Leaflet map
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Map = Backbone.View.extend({

    defaults: {
      center: [35.863760, -21.217176],
      scrollWheelZoom: false,
      zoom: 3,
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
      0: {
        terrain: {
          tileUrl: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          attribution: 'cartodb'
        },
        satellite: {
          tileUrl: 'https://api.mapbox.com/v4/geriux.om6jab39/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VyaXV4IiwiYSI6IkFYS1ZJdDgifQ.Md25z-4Qp3qtodl4kjTrZQ',
          attribution: 'mapbox'
        }
      },
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
      this.basemap = this.options.basemap;
      
      this.template = this.options.data ? this.options.data.template : 1;
      this.cartoUser = this.options.data ? this.options.data.cartoUser : '';
      this.layerData = this.options.data ? this.options.data.layer : {};

      // At beginning create the map
      this._setCartoOptions();
      this.createMap();
      this._setListeners();
    },

    /**
     * Function to set events at beginning
     */
    _setListeners: function() {
      this.refreshEvent = _.debounce(_.bind(this.refresh, this), 500);
      window.addEventListener('resize', this.refreshEvent, false);
    },

    /**
     * Function to unset events after removing the map
     */
    _unsetListeners: function() {
      window.removeEventListener('resize', this.refreshEvent, false);
    },

    /**
     * Init the Leaflet map and add basemap
     */
    createMap: function() {
      if (!this.map) {
        this.map = L.map(this.el, this.options);
        this.setBasemap(this.basemap);
        // this.createLayer();
      }
    },

    /**
     * Remove initialized map
     */
    removeMap: function() {
      if (this.layer) {
        this.map.removeLayer(this.layer);
        this.layer = null;
      }

      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      this._unsetListeners();
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
     * Sets the provided bounds in the map
     * @param {Object} bounds latlng
     */
    _setMapBounds: function(bounds) {
      this.map.fitBounds(bounds);
    },

    /**
     * Sets the default CartoDB options
     */
    _setCartoOptions: function() {
      this.cartoOpts = {
        user_name: this.cartoUser,
        type: 'cartodb',
        cartodb_logo: false,
        sublayers: [{
          sql: 'SELECT * FROM ' + this.layerData.table_name,
          cartocss: '#null {polygon-fill:red;}' // WIP
        }]
      };
    },

    /**
     * Creates the layer and it's added to the map
     */
    createLayer: function() {
      var self = this;

      cartodb.createLayer(this.map, this.cartoOpts)
        .addTo(this.map)
        .on('done', function(layer) {
          layer.setZIndex(1);

          self.layer = layer;
          self.setLayerBounds();
        })
        .on('error', function(err) {
          console.warn(err);
        });
    },

    /**
     * Gets the layer's bounds from CartoDB
     * and then its set in the map
     */
    setLayerBounds: function() {
      var self = this;
      var opts = this.cartoOpts;
      var sqlBounds = new cartodb.SQL({ user: opts.user_name});
      var sql = opts.sublayers[0].sql;

      sqlBounds.getBounds(sql).done(function(bounds) {
        self._setMapBounds(bounds);
      });
    }

  });

})(window.App || {});
