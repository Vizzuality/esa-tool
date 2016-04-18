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
      this.page = this.options.page;
      this.tabAlias = this.options.tab;
      this.data = this._getData(this.options.data);
      this.layersLoaded = false;

      this.basemap = this.data.basemap;
      this.template = this.data.template;
      this.cartoCss = App.CartoCSS['Theme' + this.template];

      this._start();
    },

    /**
     * Starts the map controller's main views
     */
    _start: function() {
      this._initMap();
    },

    /**
     * Starts the map with the data
     */
    _startMap: function() {
      var self = this;

      this._getLayerData()
        .done(function(res, layer) {
          self._parseLayerData(res, layer);
          self._updateLayer({
            setBounds: true,
            autoUpdate: true
          });
        });

      this._initDashboard({
        refresh: false
      });
    },

    /**
     * Starts the dashboard with the data
     */
    _startDashboard: _.debounce(function() {
      this._updateDashboard({
        animate: true
      });
    }, 200),

    /**
     * Initializes the map
     */
    _initMap: function() {
      var parent = this.elContent;
      this.mapEl = parent.querySelector('#mapView');
      var sliderEl = parent.querySelector('#sliderView');
      var basemapEl = parent.querySelector('#basemapView');
      var defaultBaseMap = basemapEl.getAttribute('data-basemap');
      var customBaseMapUrl = basemapEl.getAttribute('data-basemap-url');
      var customBaseMap = {};

      customBaseMap.url = defaultBaseMap === 'custom' ?
        customBaseMapUrl : null;

      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      this.map = new App.View.Map({
        el: this.mapEl,
        data: this.data,
        cartoCss: this.cartoCss,
        basemap: defaultBaseMap,
        customBaseMap: customBaseMap
      });

      this.mapBasemap = new App.View.MapBasemap({
        el: basemapEl,
        basemap: defaultBaseMap
      });

      this.sliderTrans = new App.View.SliderTransparency({
        el: sliderEl
      });

      this.listenTo(this.map, 'map:tile:loaded', this._startMap);
      this.listenTo(this.map, 'map:layers:loaded', this._onLayersLoaded);
      this.listenTo(this.mapBasemap, 'basemap:set', this.setBase);
      this.listenTo(this.sliderTrans, 'slider:changed', this.onSliderTransChange.bind(this));
    },

    /**
     * Initializes the dashboard
     */
    _initDashboard: function(params) {
      var parent = this.elContent;
      var dashboardEl = parent.querySelector('#dashboardView');

      if (this.dashboard) {
        this.dashboard.remove(params);
        this.dashboard = null;
      }

      this.dashboard = new App.View.Dashboard({
        el: dashboardEl,
        data: this.data
      });

      this.listenTo(this.dashboard, 'dashboard:filter', this._setFilter);
      this.listenTo(this.dashboard, 'dashboard:update:layer', this._updateByLayer);
      this.listenTo(this.dashboard, 'dashboard:update:year', this._updateByYear);
    },

    /**
     * Gets the needed data to pass it to the map view
     * @param {Object} raw data from the backend
    */
    _getData: function(data) {
      var formattedData = {};

      if (data) {
        var caseStudy = data.case_study;
        formattedData.cartoUser = data.cartodb_user;

        if (caseStudy) {
          var pages = caseStudy.valid_pages;
          formattedData.template = caseStudy.template;

          if (pages) {
            var page = pages[this.page - 1];

            if (page) {
              formattedData.columnSelected = page.column_selected;
              formattedData.pageType = page.page_type;
              formattedData.layers = page.data_layers;
              formattedData.charts = page.charts;
              formattedData.pointsInterest = page.interest_points;
              formattedData.colorPalette = page.color_palette;
            }
          }
        }
      }
      return formattedData;
    },

    /**
     * Gets the data for the dashboard from the data object
     */
    _getDashboardData: function() {
      // Page type 3 = Map
      // Page type 2 = Timeline
      var pageType = this.data.pageType;

      if (pageType === 3) {
        return this._getDashboardMapData();
      } else if(pageType === 2) {
        return this._getDashboardTimelineData();
      }
    },

    _getDashboardMapData: function() {
      var self = this;
      var data = this.data;
      var layers = data.layers;

      var currentLayer = this.currentLayer;
      var layer = _.findWhere(layers, { table_name: currentLayer });
      var column = layer.layer_column;
      var table = layer.table_name;

      if (layer.isRaster) {
        return this._getRasterDashboardData();
      } else {
        var query = 'SELECT ' + column + ' as category, ' +
        'ROUND( COUNT(*) * 100 / SUM(count(*) ) OVER(), 2 ) AS value ' +
        'FROM ' + table + ' WHERE '+ column + ' IS NOT NULL GROUP BY ' + column + ' ' +
        'ORDER BY ' + column + ' ASC, value DESC LIMIT 30';

        query = query.replace('%1', query);

        return this._getCartoDashboardData(query, data);
      }

    },

    _getDashboardTimelineData: function() {

      var self = this;
      var data = this.data;
      var layers = data.layers;
      var subquery = '';
      var query = 'SELECT * FROM (%1) ' +
        't ORDER BY year, value ASC';

      if (layers) {
        layers.forEach(function(layer, i) {
          var column = data.columnSelected;
          var table = layer.table_name;

          subquery += '(SELECT ' + column + ' as category, year, ' +
            'ROUND( COUNT(*) * 100 / SUM(count(*) ) OVER(), 2 ) AS value ' +
            'FROM ' + table + ' WHERE '+ column + ' IS NOT NULL GROUP BY ' + column + ', year ' +
            'ORDER BY ' + column + ' ASC, value DESC LIMIT 30)';

          if (i < layers.length - 1) {
            subquery += ' UNION ';
          }
        });
      }

      query = query.replace('%1', subquery);

      return this._getCartoDashboardData(query, data);
    },

    _getRasterDashboardData: function() {
      var defer = new $.Deferred();
      var layer = _.findWhere(this.data.layers, { table_name: this.currentLayer });
      var catsArray = [];
      var data = {
        rows: []
      };

      var categories = App.Helper.deserialize(layer.raster_categories);
      _.each(categories, function(item, key) {
        catsArray.push({
          category: parseFloat(key),
          value: parseFloat(key),
          label: item
        });
      });

      data.rows = _.sortBy(catsArray, 'category');

      defer.resolve(data);

      return defer;
    },

    _getCartoDashboardData: function(query, data) {
      var sql = new cartodb.SQL({ user: data.cartoUser });
      var cartoQuery = sql.execute(query);

      return cartoQuery;
    },

    /**
     * Gets the data from CartoDB
     * @param {Object} layer data
     */
    _getLayerData: function() {
      // Page type 3 = Map
      // Page type 2 = Timeline
      var pageType = this.data.pageType;

      if (pageType === 3) {
        return this._getLayerDataMap();
      } else if(pageType === 2) {
        return this._getLayerDataTimeline();
      }
    },

    _getLayerDataTimeline: function() {
      var data = this.data;
      var layers = this.data.layers;

      if (!this.currentYear) {
        var layer = layers[layers.length -1];
        this.currentYear = layer.year;
      }

      var year = this.currentYear;
      var layer = _.findWhere(layers, { year: year });
      layer.layer_column = this.data.columnSelected;

      return this._getCartoData(data, layer);
    },

    _getLayerDataMap: function() {
      var data = this.data;
      var layers = this.data.layers;

      if (this.tabAlias && !this.currentLayer) {
        var tab = this.tabAlias.split('-')[0];
        if (_.findWhere(layers, { layer_column_alias: this.tabAlias })){
          this.currentLayer = _.findWhere(layers, { layer_column_alias: tab }).table_name;
        } else {
          this.currentLayer = _.findWhere(layers, { layer_column: tab }).table_name;
        }
      } else if (!this.currentLayer) {
        this.currentLayer = _.first(layers).table_name;
      }

      var layer = _.findWhere(layers, { table_name: this.currentLayer });

      if (layer.raster_type){
        layer.isRaster = true;
        return this._getRasterData(layer);
      } else {
        layer.isRaster = false;
        return this._getCartoData(data, layer);
      }

    },

    _getRasterData: function(layer) {
      //return directly the columns get in backoffice due to
      // this query takes too much time
      var defer = new $.Deferred();
      defer.resolve({ rows: layer.raster_categories }, layer);

      return defer;
    },

    _getCartoData: function(data, layer) {
      var sql = new cartodb.SQL({ user: data.cartoUser });
      var cartoOpts = {
        table : layer.table_name,
        column : layer.layer_column,
        limit: 30
      };

      var query = 'SELECT {{column}} as column FROM {{table}} \
       GROUP BY {{column}} ORDER BY {{column}} LIMIT {{limit}}';

      var cartoQuery = sql.execute(query, cartoOpts);

      return cartoQuery;
    },

    /**
     * Middle parser to format the raster categories
     * @param {Object} cat categories
     */
    _parseRasterCategoryData: function(cat) {
      var categories = App.Helper.deserialize(cat);
      var data = {};
      _.each(categories, function(item, key) {
        data[key] = [];
        data[key].push({column:parseFloat(key), label:item});
      });
      return data;
    },

    /**
     * Parser to group the recieved data for the views
     * @param {Object} res response from CartoDB
     * @param {Object} layer data
     */
    _parseLayerData: function(res, layer) {
      var self = this;
      var groups;
      var data = res.rows;
      if (layer.isRaster){
        groups = this._parseRasterCategoryData(res.rows);
      } else {
        groups = _.groupBy(data, 'column');
      }
      var palette, currentLayer;
      var count = 0;

      //ColorPalette 3 = custom color palette
      if (this.data.colorPalette === 3) {
        if (this.data.pageType === 3) {
          currentLayer = _.findWhere(this.data.layers, { table_name: this.currentLayer });
        } else {
          currentLayer = _.findWhere(this.data.layers, { year: this.currentYear });
        }

        var labels = currentLayer.raster_categories ? App.Helper.deserialize(currentLayer.raster_categories):{};
        var colors = currentLayer.custom_columns_colors ? App.Helper.deserialize(currentLayer.custom_columns_colors):{};
        _.map(groups, function(g) {
          var gr = g[0];
          gr.color = colors[gr.column];
          gr.index = count;
          gr.label = labels[gr.column];
          count ++;
        });
        this.data.categories = groups;
      } else {
        if (this.data.colorPalette === 2) {
          palette = this.cartoCss.palette2;
        } else {
          palette = this.cartoCss.palette1;
        }
        var numColors = palette.length;

        _.map(groups, function(g) {
          var gr = g[0];

          if (count > numColors - 1) {
            count = 0;
          }

          gr.color = palette[count];
          gr.index = count;
          count++;
        });
        this.data.categories = groups;
      }

    },

    /**
     * Slider change layers transparency
     * @param {number} opacity
     */
    onSliderTransChange: function(opacity) {
      this.map.trigger('transparency:changed', opacity);
    },

    /**
     * Sets the current year
     * and updates the layers
     * @param {Object} parameters
     */
    _updateLayer: function(params) {
      var data = this.data;
      var layers = data.layers;
      var year = this.currentYear;
      var currentLayer = this.currentLayer;
      var layer = _.findWhere(layers, { table_name: currentLayer });

      if (this.currentYear) {
        layer = _.findWhere(layers, { year: year });
      } 

      if (layer) {
        this.currentYear = year;
        this.layersLoaded = false;

        this.map.createLayer({
          layer: layer,
          data: data,
          setBounds: params.setBounds,
          autoUpdate: params.autoUpdate
        });
      }
    },

    /**
     * Updates the dashboard with the data
     * @param {Object} layer data
     */
    _updateDashboard: function(params) {
      var self = this;

      if (this.data && this.data.dashboard) {
        this._updateDashboardData(params);
      } else {
        this._getDashboardData()
          .done(function(res) {
            self._parseDashboardData(res, params);
            self.dashboard.start();
          });
      }
    },

    /**
     * Dashboard data parser
     * prepares the data for the view
     * @param {Object} response data
     * @param {Object} parameters
     */
    _parseDashboardData: function(data, params) {
      data = data.rows;
      if (data) {
        var groups = this.data.categories;
        _.map(data, function(d) {
          var group = groups[d.category];

          if (group && group[0]) {
            d.color = group[0].color;
            d.label = group[0].label;
          }
        });


        var categories = _.keys(_.groupBy(data, 'category'));

        this.data.categoriesData = categories;
        this.data.dashboard = data;

        if (this.currentYear) {
          var dataByYear = _.groupBy(data, 'year');
          this.data.dashboard = dataByYear;
        }
      }

      this._updateDashboardData(params);
    },

    /**
     * Updates the dashboard's view data
     * @param {Object} parameters
     */
    _updateDashboardData: function(params) {
      var selectedYear;
      var currentData = this.data.dashboard;
      var animate = params.animate;

      if (this.currentYear) {
        currentData = this.data.dashboard[this.currentYear];
        selectedYear = this.currentYear.toString();
      }

      this.dashboard.update({
        data: this.data,
        currentData: currentData,
        currentYear: selectedYear,
        animate: animate,
        unit: '%'
      }, this.currentLayer);
    },

    /**
     * Filters the map's layers by category
     * @param {String} category name
     */
    _setFilter: function(filter) {
      this.map.highLightCategory(filter);
    },

    /**
     * Triggered when the year has changed
     * and updates the layer and dashboard
     * @param {Number} year
     */
    _updateByYear: _.debounce(function(year) {
      if (year !== this.currentYear) {
        this.currentYear = year;

        this._updateLayer({
          setBounds: false,
          autoUpdate: false
        });

        this._updateDashboard({
          animate: false
        });
      }
    }, 30),

    /**
     * Triggered when the layer has changed
     * and updates the layer and dashboard
     * @param {String} layer table name
     */
    _updateByLayer: _.debounce(function(layer) {
      if (layer !== this.currentLayer) {
        var self = this;

        this.currentLayer = layer;
        this.data.dashboard = null;

        this._getLayerData()
          .done(function(res, layer) {
            self._parseLayerData(res, layer);
            self._updateLayer({
              setBounds: true,
              autoUpdate: true
            });
          });

        this._initDashboard({
          refresh: true
        });
      }
    }, 30),

    /**
     * Triggered when all of the
     * layer's tiles have loaded
     * then updates the dashboard state
     * @param {Object} parameters
     */
    _onLayersLoaded: function(params) {
      var data = this.data;
      this.layersLoaded = true;

      if (params.autoUpdate) {
        this._startDashboard();
      }

      params.layersLoaded = true;
      params.currentYear = this.currentYear;

      this.dashboard.updateState(params);
      this.map.addPointInterests(data);
      this.map.showControls();
    },

    /**
     * Removes the map and basemap view and the listening events.
     */
    remove: function() {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      if (this.sliderTrans) {
        this.sliderTrans.remove();
        this.sliderTrans = null;
      }

      if (this.mapBasemap) {
        this.mapBasemap.remove();
        this.mapBasemap = null;
      }

      if (this.dashboard) {
        this.dashboard.remove({
          refresh: false
        });
        this.dashboard = null;
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
