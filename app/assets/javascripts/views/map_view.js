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
      zoomControl: false,
      basemap: 'terrain',
      customBaseMap: {
        url:''
      }
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
          tileUrl: 'https://api.mapbox.com/v4/alexdontsurf.fa9a7462/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWxleGRvbnRzdXJmIiwiYSI6IlU5MWZ4TU0ifQ.Ro2ZkpiiUpzhResB5Lr04A',
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
      this.customBaseMap = this.options.customBaseMap;
      this.cartoCss = this.options.cartoCss || '';
      this.cartoUser = this.options.data ? this.options.data.cartoUser : '';
      this.template = this.options.data ? this.options.data.template : 1;
      this.layers = [];
      this.loadQueue = [];
      this.tileLoaded = false;
      this.autoUpdate = true;

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
      }
    },

    /**
     * Removes the instanced layers
     */
    removeLayer: function() {
      var layers = this.layers;

      if (layers) {
        for (var layer in layers) {
          var layerInstance = layers[layer];
          this.map.removeLayer(layerInstance);
        }
        this.layers = [];
      }
    },

    /**
     * Remove initialized map
     */
    removeMap: function() {
      this.removeLayer();

      if (this.map) {
        this.map.remove();
        this.map = [];
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
      var self = this;
      var tile, attribution, attributionUrl;

      if (type === 'custom') {
        tile = {
          custom: {
            tileUrl: this.customBaseMap.url
          }
        };
        attributionUrl = '';
      } else {
        tile = this.basemaps[this.template];
        attribution = tile[type].attribution;
        attributionUrl = this.attributions[attribution];
      }

      if (this.tileLayer) {
        this.map.removeLayer(this.tileLayer);
        this.tileLayer = null;
      }

      if (tile) {
        this.tileLayer = L.tileLayer(tile[type].tileUrl, {
          attribution: attributionUrl
        }).addTo(this.map);

        this.tileLayer.on('load', function() {
          self._onTileLoaded();
        });
      }
    },

    /**
     * Sets the tile loaded state
     * and triggers an event
     */
    _onTileLoaded: function() {
      if (!this.tileLoaded) {
        this.tileLoaded = true;
        this.trigger('map:tile:loaded');
      }
    },

    /**
     * Sets the provided bounds in the map
     * @param {Object} bounds latlng
     */
    _setMapBounds: function(bounds) {
      if (bounds) {
        this.map.fitBounds(bounds);
      }
    },

    /**
     * Creates the layer with or without bounds
     * @param {Object} layer parameters
     */
    createLayer: function(params) {

      // Remove previous if it exists
      this.removeLayer();

      this.autoUpdate = params.autoUpdate;
      if (params.setBounds) {
        this._setLayerBounds(params);
      } else {
        this._addLayers(params);
      }
    },

    /**
     * Adds the layers in the map
     * @param {Object} layer parameters
     */
    _addLayers: function(params) {
      var self = this;
      var layers = this._setLayers(params);

      layers.forEach(function(layerData) {
        var cartoOpts = {
          user_name: self.cartoUser,
          type: 'cartodb',
          cartodb_logo: false,
          sublayers: [{
            sql: layerData.sql,
            cartocss: layerData.cartocss
          }]
        };

        self._addToLoadingQueue(layerData.category);

        cartodb.createLayer(self.map, cartoOpts)
          .addTo(self.map)
          .on('done', function(layer) {
            layer.setZIndex(1);
            layer.bind('load', function() {
              self._removeFromLoadingQueue(layerData.category);
            });
            self.layers[layerData.category] = layer;
          })
          .on('error', function(err) {
            console.warn(err);
          });
      });
    },

    /**
     * Create marker to the map
     */
    createMarker: function(latLng, options, popUp) {
      var self = this;
      var marker = L.marker(latLng, options);
      if (popUp) {
        marker.bindPopup(popUp);
      }
      marker.addTo(this.map)
    },

    /**
     * Highlight a layer by category
     * @param {String} category name
     */
    highLightCategory: function(category) {
      var layers = this.layers;

      for (var layer in layers) {
        if (category === '') {
          layers[layer].setOpacity(1);
        } else if (layer !== category) {
          layers[layer].setOpacity(0.1);
        } else {
          layers[layer].setOpacity(1);
        }
      }
    },
    /**
     * Generates and sets the cartocss for the layer
     * @param {Object} layer parameters
     */
    _setLayers: function(params) {
      var self = this;
      var table = params.layer.table_name;
      var column =  params.layer.layer_column || params.data.columnSelected;
      var cartoCss = this.cartoCss;
      var groups = params.data.categories;
      var defaultCarto = cartoCss['default'];
      var dataCarto = cartoCss['data'];
      var layers = [];

      defaultCarto = '#' + table + this._formatCartoCss(defaultCarto);

      for (var group in groups) {
        var category = groups[group][0];
        var cat = category.column;
        var color = category.color;
        var index = category.index;
        var data = dataCarto[index];

        if (data) {
          index = index + 1;
          index = index.toString();
          var carto = self._formatCartoCss(data, index, color);

          layers.push({
            category: cat,
            sql: 'SELECT * FROM ' + table +
              ' WHERE ' + column + ' = \'' + group + '\'',
            cartocss: defaultCarto + '#' + table +
            '[' + column + '="' + cat + '"]' + carto
          });
        }
      }

      return layers;
    },

    /**
     * Formats the plain cartocss with the colors
     * of the current template.
     * @params {String} carto Default template carto code.
     * @params {String} index Current element index.
     * @params {String} color RGB hex color for the element.
     */
    _formatCartoCss: function(carto, index, color) {
      carto = JSON.stringify(carto);
      carto = carto.replace(/\"/g, '');
      carto = carto.replace(/\,/g, ';');
      carto = carto.replace(/\}/g, ';}');

      if (index) {
        var search = new RegExp('%' + index, 'gi');
        carto = carto.replace(search, color);
      }

      return carto;
    },

    /**
     * Gets the layer's bounds from CartoDB
     * and then its set in the map
     * @param {Object} layer parameters
     */
    _setLayerBounds: function(params) {
      var self = this;
      var sqlBounds = new cartodb.SQL({ user: this.cartoUser });
      var sql = 'SELECT the_geom FROM ' + params.layer.table_name;

      sqlBounds.getBounds(sql).done(function(bounds) {
        self._setMapBounds(bounds);
        self._addLayers(params);
      });
    },

    /**
     * Adds a layer to the loading queue
     * @param {String} layer category
     */
    _addToLoadingQueue: function(category) {
      var queue = _.clone(this.loadQueue);
      var index = queue.indexOf(category);

      if(index === -1) {
        queue.push(category);
        this.loadQueue = queue;
        this._checkLoadQueue();
      }
    },

    /**
     * Removes a layer to the loading queue
     * @param {String} layer category
     */
    _removeFromLoadingQueue: function(category) {
      var queue = _.clone(this.loadQueue);
      var index = queue.indexOf(category);

      if(index > -1) {
        queue.splice(index, 1);
        this.loadQueue = queue;
        this._checkLoadQueue();
      }
    },

    /**
     * Checks the loading queue to check
     * if all layers have loaded or not
     */
    _checkLoadQueue: function() {
      var queue = this.loadQueue;

      if(queue.length > 0) {
        // Show a loader while the layers are loading
      } else {
        var params = {
          autoUpdate: this.autoUpdate
        };

        this.trigger('map:layers:loaded', params);
      }
    },

    /**
     * Returns the point that is a distance and heading away from
     * the given origin point.
     * https://github.com/makinacorpus/Leaflet.GeometryUtil
     * @param {L.LatLng} latlng: origin point
     * @param {float}: heading in degrees, clockwise from 0 degrees north.
     * @param {float}: distance in meters
     * @returns {L.latLng} the destination point.
     * Many thanks to Chris Veness at http://www.movable-type.co.uk/scripts/latlong.html
     * for a great reference and examples.
     */
    destination: function(latlng, heading, distance) {
      heading = (heading + 360) % 360;
      var rad = Math.PI / 180,
          radInv = 180 / Math.PI,
          R = 6378137, // Aprox Earth Radius in meters
          lon1 = latlng.lng * rad,
          lat1 = latlng.lat * rad,
          rheading = heading * rad,
          sinLat1 = Math.sin(lat1),
          cosLat1 = Math.cos(lat1),
          cosDistR = Math.cos(distance / R),
          sinDistR = Math.sin(distance / R),
          lat2 = Math.asin(sinLat1 * cosDistR + cosLat1 *
            sinDistR * Math.cos(rheading)),
          lon2 = lon1 + Math.atan2(Math.sin(rheading) * sinDistR *
            cosLat1, cosDistR - sinLat1 * Math.sin(lat2));

      lon2 = lon2 * radInv;
      lon2 = lon2 > 180 ? lon2 - 360 : lon2 < -180 ? lon2 + 360 : lon2;

      return L.latLng([lat2 * radInv, lon2]);
    },

    /**
     * Adds the points of interest in the map
     * @param {Object} points data
     */

    addPointInterests: function(data) {
      var self = this;
      var pointsInterest = data.pointsInterest;
      var styles = this.cartoCss;

      pointsInterest.forEach(function(point) {
        var latLng = L.latLng(point.lat, point.lng);
        var radius = point.radius * 1000;
        var newPoint = L.circle(latLng, radius, {
          fill: false,
          color: styles.main,
          weight: 1
        });

        var textLatLng = self.destination(latLng, 180, radius);

        var myTextLabel = L.marker(textLatLng, {
            icon: L.divIcon({
                className: 'pointInterestText',
                iconSize: [100, 16],
                html: '<div class="label">' + point.name + '</div>'
            }),
            zIndexOffset: 1000
        });

        var group = L.featureGroup([newPoint, myTextLabel]);

        group.on('click', function(e) {
          var layers = this.getLayers();
          var layer = layers[0];

          if (layer) {
            var bounds = layer.getBounds();
            self.map.fitBounds(bounds, {
              paddingBottomRight: [400, 0]
            });
          }
        });

        group.addTo(self.map);
      });
    },

    /**
     * Fit the map in the bounds passed
     * @param {Object} bounds
     */

    fitBounds: function(bounds, options) {
      this.map.fitBounds(bounds, options);
    }
  });

})(window.App || {});
