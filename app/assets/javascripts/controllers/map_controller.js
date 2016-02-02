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
     * Starts the map controller
     */
    _start: function() {
      // Initialize main views
      this._initMap();
    },

    /**
     * Starts the map with the data
     */
    _startMap: function() {
      var self = this;
      var layers = this.data.layers;
      var layer = layers[layers.length -1];

      if (layer) {
        this.currentYear = layer.year;

        this._getLayerData()
          .done(function(res) {
            self._parseLayerData(res);
            self._updateLayer({
              setBounds: true,
              autoUpdate: true
            });
          });
      }

      this._initDashboard();
    },

    /**
     * Starts the dashboard with the data
     */
    _startDashboard: _.debounce(function() {
      this._updateDashboard();
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
              formattedData.layers = page.data_layers;
              formattedData.charts = page.charts;
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
            'ORDER BY ' + column + ' ASC, value DESC LIMIT 6)';

          if (i < layers.length - 1) {
            subquery += ' UNION ';
          }
        });
      }

      query = query.replace('%1', subquery);
      var sql = new cartodb.SQL({ user: data.cartoUser });
      var cartoQuery = sql.execute(query);

      return cartoQuery;
    },

    /**
     * Gets the data from CartoDB
     * @param {Object} layer data
     */
    _getLayerData: function() {
      var year = this.currentYear;
      var data = this.data;
      var layers = this.data.layers;
      var layer = _.findWhere(layers, { year: year });

      var sql = new cartodb.SQL({ user: data.cartoUser });
      var table = layer.table_name;
      var column = data.columnSelected;
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

    _updateLayer: function(params) {
      var data = this.data;
      var year = this.currentYear;
      var layers = data.layers;
      var layer = _.findWhere(layers, { year: year });

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
    _updateDashboard: function() {
      var self = this;

      if (this.data && this.data.dashboard) {
        this._updateDashboardData();
      } else {
        this._getDashboardData()
          .done(function(res) {
            self._parseDashboardData(res);
            self.dashboard.start();
          });
      }
    },

    _parseDashboardData: function(data) {
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

      this._updateDashboardData();
    },

    _updateDashboardData: function() {
      var currentYearData = this.data.dashboard[this.currentYear];
      var selectedYear = this.currentYear.toString();

      this.dashboard.update({
        data: this.data,
        currentData: currentYearData,
        currentYear: selectedYear
      });
    },

    /**
     * Filters the map's layers by category
     * @param {String} category name
     */
    _setFilter: function(filter) {
      this.map.highLightCategory(filter);
    },

    _updateByYear: _.debounce(function(year) {
      if (year !== this.currentYear) {
        this.currentYear = year;

        this._updateLayer({
          setBounds: false,
          autoUpdate: false
        });

        this._updateDashboard();
      }
    }, 30),

    _onLayersLoaded: function(params) {
      this.layersLoaded = true;

      if (params.autoUpdate) {
        this._startDashboard();
      }

      params.layersLoaded = true;
      params.currentYear = this.currentYear;

      this.dashboard.updateState(params);
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
