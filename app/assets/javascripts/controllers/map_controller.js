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

      this.basemap = this.data.basemap;
      this.template = this.data.template;
      this.cartoCss = App.CartoCSS['Theme' + this.template];

      this._start();
    },

    /**
     * Starts the map controller
     */
    _start: function() {
      var layers = this.data.layers;

      // Initialize main views
      this._initMap();
      this._initDashboard();

      // Set default layer
      if (layers) {
        // TODO: Specify year instead of index
        this.renderLayer(0, true);
      }
    },

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

      this.listenTo(this.dashboard, 'dashboard:filter', this._setFilter, this);
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
    _getDashboardData: function(layer) {
      var self = this;
      var data = this.data;

      var sql = new cartodb.SQL({ user: data.cartoUser });
      var table = layer.table_name;
      var column = layer.column_selected;
      var query = 'SELECT {{column}} as category, year, \
        ROUND( COUNT(*) * 100.0 / SUM(count(*) ) OVER(), 2 ) AS value \
        FROM {{table}} GROUP BY {{column}}, year \
        ORDER BY {{column}} ASC';

      var cartoQuery = sql.execute(query, 
        { column: column, table: table });

      return cartoQuery;
    },

    /**
     * Gets the data from CartoDB
     * @param {Object} layer data
     */
    _getLayerData: function(layer) {
      var self = this;
      var data = this.data;

      var sql = new cartodb.SQL({ user: data.cartoUser });
      var table = layer.table_name;
      var column = layer.column_selected;
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

      layer.groups = groups;
    },

    /**
     * Renders the layer in the map
     * @param {Number} year to filter the layer
     * @param {Boolean} sets bounds if true
     */
    renderLayer: function(index, bound) {
      var self = this;
      var layers = this.data.layers;
      var layer = layers[index];
      this.data.currentLayer = layer;

      this._getLayerData(layer)
        .done(function(res) {
          self._parseLayerData(res, layer);
          self.map.createLayer(layer, bound);
          self._updateDashboard(layer);
        });
    },

    /**
     * Updates the dashboard with the data 
     * @param {Object} layer data
     */
    _updateDashboard: function(layer) {
      var self = this;

      this._getDashboardData(layer)
        .done(function(res) {
          self.data.currentLayer.categories = res.rows;
          self.dashboard.update(self.data);
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
