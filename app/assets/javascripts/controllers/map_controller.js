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
        .done(function(res) {
          self._parseLayerData(res);
          self._updateLayer({
            setBounds: true,
            autoUpdate: true
          });
        });

      this._initDashboard();
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
      var mapEl = parent.querySelector('#mapView');
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
        el: mapEl,
        data: this.data,
        cartoCss: this.cartoCss,
        basemap: defaultBaseMap,
        customBaseMap: customBaseMap
      });

      this.mapBasemap = new App.View.MapBasemap({
        el: basemapEl,
        basemap: defaultBaseMap
      });

      this.listenTo(this.map, 'map:tile:loaded', this._startMap);
      this.listenTo(this.map, 'map:layers:loaded', this._onLayersLoaded);
      this.listenTo(this.mapBasemap, 'basemap:set', this.setBase);
    },

    /**
     * Initializes the dashboard
     */
    _initDashboard: function() {
      var parent = this.elContent;
      var dashboardEl = parent.querySelector('#dashboardView');

      if (this.dashboard) {
        this.dashboard.remove();
        this.dashboard = null;
      }

      this.dashboard = new App.View.Dashboard({
        el: dashboardEl
      });

      this.listenTo(this.dashboard, 'dashboard:filter', this._setFilter);
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
          var pages = caseStudy.pages;
          formattedData.template = caseStudy.template;

          if (pages) {
            var page = pages[this.page - 1];

            if (page) {
              formattedData.columnSelected = page.column_selected;
              formattedData.pageType = page.page_type;
              formattedData.layers = page.data_layers;
              formattedData.charts = page.charts;
              formattedData.pointsInterest = page.interest_points;
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

      var query = 'SELECT ' + column + ' as category, ' +
            'ROUND( COUNT(*) * 100 / SUM(count(*) ) OVER(), 2 ) AS value ' +
            'FROM ' + table + ' GROUP BY ' + column + ' ' +
            'ORDER BY ' + column + ' ASC, value DESC LIMIT 7';

      console.log(query);

      query = query.replace('%1', query);

      return this._getCartoDashboardData(query, data);
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
            'FROM ' + table + ' GROUP BY ' + column + ', year ' +
            'ORDER BY ' + column + ' ASC, value DESC LIMIT 7)';

          if (i < layers.length - 1) {
            subquery += ' UNION ';
          }
        });
      }

      query = query.replace('%1', subquery);

      return this._getCartoDashboardData(query, data);
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

      return this._getCartoData(data, layer);
    },

    _getLayerDataMap: function() {
      var data = this.data;
      var layers = this.data.layers;

      if (!this.currentLayer) {
        var layer = _.first(layers);
        this.currentLayer = layer.table_name;
      }

      var currentLayer = this.currentLayer;
      var layer = _.findWhere(layers, { table_name: currentLayer });

      return this._getCartoData(data, layer);
    },

    _getCartoData: function(data, layer) {
      var sql = new cartodb.SQL({ user: data.cartoUser });
      var table = layer.table_name;
      var column = layer.layer_column;

      var query = 'SELECT {{column}} as column FROM {{table}} \
       GROUP BY {{column}} ORDER BY {{column}}';

      var cartoQuery = sql.execute(query,
        { column: column, table: table });

      return cartoQuery;
    },

    /**
     * Parser to group the recieved data for the views
     * @param {Object} res response from CartoDB
     * @param {Object} layer data
     */
    _parseLayerData: function(res, layer) {
      var data = res.rows;
      var groups = _.groupBy(data, 'column');
      var palette = this.cartoCss.palette;
      var numColors = palette.length;
      var count = 0;

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
          }
        });

        var categories = _.keys(_.groupBy(data, 'category'));
        var dataByYear = _.groupBy(data, 'year');

        this.data.dashboard = dataByYear;
        this.data.categoriesData = categories;
      }

      this._updateDashboardData(params);
    },

    /**
     * Updates the dashboard's view data
     * @param {Object} parameters
     */
    _updateDashboardData: function(params) {
      console.log(this.data.dashboard);
      var currentYearData = this.data.dashboard[this.currentYear];
      var selectedYear = this.currentYear.toString();
      var animate = params.animate;

      this.dashboard.update({
        data: this.data,
        currentData: currentYearData,
        currentYear: selectedYear,
        animate: animate,
        unit: '%'
      });
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

      if (this.dashboard) {
        this.dashboard.remove();
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
