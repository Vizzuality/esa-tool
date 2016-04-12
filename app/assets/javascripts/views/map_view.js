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
      this.palette = this.options.data ? this.options.data.colorPalette : 1;
      this.layers = {};
      this.loadQueue = [];
      this.tileLoaded = false;
      this.autoUpdate = true;
      this.isRaster = false;

      this.controlsContainer = [];
      this.controlsContainer.push(this.el.parentElement.querySelectorAll('.map-controls-container')[0]);

      this.createMap();
      this._setListeners();
    },

    /**
     * Function to set events at beginning
     */
    _setListeners: function() {
      this.listenTo(this, 'transparency:changed', this.onTransparencyChange.bind(this));
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
      var self = this;
      if (!this.map) {
        this.map = L.map(this.el, this.options);
        this.setBasemap(this.basemap);

        this.zoomControl = new L.Control.Zoom({ position: 'bottomleft' }).addTo(this.map);

        var FitMapControl = L.Control.extend({

          options: {
            position: 'bottomleft'
          },

          onAdd: function () {
              var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-fit-map');
              container.onclick = function(e){
                self.restoreZoom();
              };
              L.DomEvent.disableClickPropagation(container);
              return container;
            }
        });

        this.map.addControl(new FitMapControl());
        var leafletControls = document.querySelectorAll('.leaflet-control-container')[0];
        leafletControls.classList.add('_hidden');
        this.controlsContainer.push(leafletControls);

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
        this.layers = {};
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

      if (this.zoomControl) {
        this.zoomControl = null;
      }

      if (this.controlsContainer) {
        _.each(this.controlsContainer, function(control){
          control.classList.add('_hidden');
        });
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
     * Show the map controls
     */
    showControls: function() {
      if (this.controlsContainer) {
        _.each(this.controlsContainer, function(control) {
          control.classList.remove('_hidden');
        });
      }
    },

    /**
     * Re-render the map
     */
    refresh: function() {
      this.map.invalidateSize();
    },

    /**
     * Change the transparency of the layers
     */
    onTransparencyChange: function(opacity) {
      for (var layer in this.layers) {
        this.layers[layer].setOpacity(opacity/100);
      }
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
      this.el.classList.add('_is-loading');

      this.autoUpdate = params.autoUpdate;
      if (params.setBounds) {
        this._setLayerBounds(params);
      } else {
        if (params.layer.isRaster) {
          this._addRasterLayer(params);
        } else {
          this._addLayers(params);
        }
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

        self._addCartoLayer(layerData.category, cartoOpts);

      });
    },

    /**
     * Adds the raster layer in the map
     * @param {Object} layer parameters
     */
    _addRasterLayer: function(params) {
      this.isRaster = true;
      var layer = this._setRasterLayer(params);
      var cartoOpts = {
        user_name: this.cartoUser,
        type: 'cartodb',
        cartodb_logo: false,
        sublayers: [{
          sql: layer.query,
          cartocss: layer.cartoCss,
          raster: true,
          raster_band: 1
        }]
      };

      this._addCartoLayer(params.layer.table_name, cartoOpts);
    },

    /**
     * Create the cart layer to the map
     */
    _addCartoLayer: function(category, cartoOpts) {
      var self = this;

      this._addToLoadingQueue(category);

      cartodb.createLayer(self.map, cartoOpts)
        .addTo(self.map)
        .on('done', function(layer) {
          layer.setZIndex(1);
          layer.bind('load', function() {
            self._removeFromLoadingQueue(category);
          });
          self.layers[category] = layer;
        })
        .on('error', function(err) {
          console.warn(err);
        });
    },

    /**
     * Create marker to the map
     */
    createMarker: function(latLng, options, popUp) {
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
      if (!this.isRaster) {
        var layers = this.layers;
        var layerContainer;
        for (var layer in layers) {
          layerContainer = layers[layer].getContainer();
          if (category !== '' && layer !== category) {
            if (layerContainer !== undefined) {layerContainer.classList.add('unhighlight')};
          } else {
            if (layerContainer !== undefined) {layerContainer.classList.remove('unhighlight')};
          }
        }
      }
    },

    /**
     * Generates and sets the cartocss for the layer
     * @param {Object} layer parameters
     */
    _setRasterLayer: function(params) {
      var rasterLayer = {};
      var cartoCss = this.cartoCss;
      var defaultCarto = App.CartoCSS.Raster[params.layer.raster_type];

      var rasterCss = '#' + params.layer.table_name + this._formatCartoCssRaster(defaultCarto, params.data.categories);

      rasterLayer.query = 'SELECT * FROM ' + params.layer.table_name;
      rasterLayer.cartoCss = rasterCss;
      return rasterLayer;
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
      var defaultCarto;

      if (this.palette === 2) {
        defaultCarto = cartoCss['default-p2'];
      } else {
        defaultCarto = cartoCss['default-p1'];
      }

      var dataCarto = cartoCss['data'];
      var layers = [];
      defaultCarto['polygon-opacity'] = 1;
      defaultCarto = '#' + table + this._formatCartoCss(defaultCarto);
      for (var group in groups) {
        var category = groups[group][0];
        var cat = category.column;
        var color = category.color;
        var index = category.index;

        if (dataCarto) {
          var data = _.extend({}, dataCarto);
          index = index + 1;
          if (data['polygon-fill']){
            data['polygon-fill']+=index;
          }
          if (data['line-color']){
            data['line-color']+=index;
          }
          index = index.toString();
          var carto = self._formatCartoCss(data, index, color);
          var parsedCat = typeof cat === 'number' ? cat : '\''+cat+'\'';

          layers.push({
            category: cat,
            sql: 'SELECT * FROM ' + table +
              ' WHERE ' + column + ' = ' + parsedCat + '',
            cartocss: defaultCarto + '#' + table +
            '[' + column + '=' + parsedCat + ']' + carto
          });
        }
      }

      return layers;
    },

    /**
     * Formats the plain cartocss with the colors
     * of the current template for raster type
     * @params {String} carto Default template carto code.
     * @params {String} layer Raster layer.
     */
    _formatCartoCssRaster: function(cartoCss, categories) {
      categories = _.sortBy(categories, 'column');
      var cartoTemplate = $.extend({}, cartoCss);
      var defaultCarto;

      if (this.palette === 2) {
        defaultCarto = this.cartoCss['default-p2'];
      } else {
        defaultCarto = this.cartoCss['default-p1'];
      }

      _.each(categories, function(item) {
        item = item[0];
        if (item.color.indexOf('#') !== -1 ) {
          var color = App.Helper.hexToRgba(item.color, 100);
          cartoTemplate['raster-colorizer-stops'] = cartoTemplate['raster-colorizer-stops'] + 'stop(' + (item.column) + ', ' + color + ')';
        } else {
          cartoTemplate['raster-colorizer-stops'] = cartoTemplate['raster-colorizer-stops'] + 'stop(' + (item.column) + ', ' + item.color + ')';
        }
      });

      var carto = JSON.stringify(cartoTemplate);
      carto = carto.replace(/\",/g, ';');
      carto = carto.replace(/\"/g, '');
      carto = carto.replace(/\}/g, ';}');

      return carto;
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

      if (params.layer.isRaster){
        sql = 'SELECT the_raster_webmercator FROM ' + params.layer.table_name;
        sql = 'SELECT ST_Union(ST_Transform(ST_Envelope(the_raster_webmercator), 4326)) as the_geom FROM (' + sql + ') as t';
        // var sql =  'select st_asgeojson(box2d(st_collect(st_envelope(the_raster_webmercator)))) FROM ' + params.layer.table_name;
      }

      sqlBounds.getBounds(sql).done(function(bounds) {
        self.bounds = bounds;
        self._setMapBounds(bounds);
        if (params.layer.isRaster){
          self._addRasterLayer(params);
        } else {
          self._addLayers(params);
        }

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
        this.el.classList.remove('_is-loading');
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
            self.fitBounds(bounds, {
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
    },

    /**
     * Fit the map in initial state
     */

    restoreZoom: function() {
      this.map.fitBounds(this.bounds);
    }
  });

})(window.App || {});
