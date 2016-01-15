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
      
      this.template = this.data.template
      this.cartoCss = App.CartoCSS['Theme' + this.template];

      this._start();
    },

    _start: function() {
      var self = this;

      this._getCategories()
        .done(function(res) {
          self._parseCategoriesData(res);
          self._initMap();
        });

    },

    /**
     * Initializes the map
     */
    _initMap: function() {
      var parent = this.elContent;
      var mapEl = parent.querySelector('#mapView');
      var basemapEl = parent.querySelector('#basemapView');

      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      this.map = new App.View.Map({ 
        el: mapEl,
        data: this.data,
        categories: this.categoriesData,
        cartoCss: this.cartoCss
      });

      // Creates a CartoDB layer
      this.map.createLayer();

      this.mapBasemap = new App.View.MapBasemap({
        el: basemapEl
      });

      this.listenTo(this.mapBasemap, 'basemap:set', this.setBase);
    },

    /**
     * Gets the needed data to pass it to the map view 
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
              formattedData.layer = page.data_layer;
            }
          }
        }
      }
      return formattedData;
    },

    /**
     * Gets the data from CartoDB
     */
    _getCategories: function() {
      var self = this;
      var data = this.data;
      var sql = new cartodb.SQL({ user: data.cartoUser });
      var table = data.layer.table_name;
      var column = data.layer.column_selected;

      var cartoQuery = sql.execute('SELECT count({{column}}) as sum, {{column}} as category FROM {{table}} GROUP BY {{column}}', 
        { column: column, table: table });

      return cartoQuery;
    },

    /**
     * Parser to group the recieved data for the views
     * @param {Object} res response from CartoDB
     */
    _parseCategoriesData: function(res) {
      var data = res.rows;
      var groups = _.groupBy(data, 'category');
      var palette = this.cartoCss.palette;
      var numColors = palette.length;
      var count = 0;

      _.map(groups, function(g) {
        var gr = g[0];

        if (count > numColors) {
          count = 0;
        }

        gr.color = palette[count];
        gr.index = count;
        count++;
      });

      this.data.layer.groups = groups;
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
