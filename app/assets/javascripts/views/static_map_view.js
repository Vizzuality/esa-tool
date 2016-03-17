'use strict';

/**
 * Static Map View get the image of generated map
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.StaticMapView = Backbone.View.extend({

    defaults: {
      cartoOpt: {
        tiler_domain: 'cartodb.com',
        tiler_port: '80',
        tiler_protocol: 'http',
        layers: []
      },
      basemap: {
        type: "http",
        options: {
          urlTemplate: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          subdomains: [ "a", "b", "c" ]
        }
      }
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.layer = this.options.layer;
      this.cartodbUser = this.options.data.cartodbUser;
      this.cartoOpt = this.options.cartoOpt;
      this.basemap = this.options.basemap;
      this.caseStudy = this.options.caseStudy;

      this._createMapImageLayer();
    },

    /**
     * Adds the image map in the case study
     */
    _createMapImageLayer: function() {
      var self = this;
      var layer= this.layer;
      var isRaster = layer.raster_type ? true : false;

      this.cartoOpt.layers = [];
      this.cartoOpt.layers.push(this.basemap);

      this.cartoOpt.user_name = this.cartodbUser;

      var query = 'SELECT * FROM ' + layer.table_name;

      var options = {
        sql: query,
        cartocss_version: '2.3.0'
      };

      if (isRaster) {

        options.raster = true;
        options.raster_band = 1;
        options.geom_type = 'raster';
        options.geom_column = 'the_raster_webmercator';
        options.cartocss = '#' + layer.table_name + '{raster-opacity:1; raster-colorizer-default-color: #FFF;raster-colorizer-stops:stop(0, rgba(255,255,255,0))stop(1, rgba(255,255,255,0.2))}';

        query = 'SELECT the_raster_webmercator FROM ' + layer.table_name;
        query = 'SELECT ST_Union(ST_Transform(ST_Envelope(the_raster_webmercator), 4326)) as the_geom FROM (' + query + ') as t';

      } else {
        options.cartocss = '#' + layer.table_name + '{polygon-fill: #ccc; ' +
            'polygon-opacity: 0.1;line-color: #FFF; ' +
            'line-width: 0.9;line-opacity: 0.2 ;}';
      }

      this.cartoOpt.layers.push({
        type: 'cartodb',
        options: options
      });

      var optsC = _.extend({}, self.cartoOpt);

      var sql = new cartodb.SQL({ user: this.cartodbUser });

      sql.getBounds(query)
        .done(function(bounds) {
          self._getImage(optsC, bounds);
        })
        .error(function() {
          self.el.classList.remove('_is-loading');
        });

    },

    /**
     * Generates the image from CartoDB
     * @params {Object} layer options
     * @params {Object} return bounds
     */
    _getImage: function(optsC, bounds) {
      var self = this;
      var mapBounds = [bounds[1][1], bounds[1][0], bounds[0][1], bounds[0][0]];

      var image = cartodb.Image(optsC)
      .size(800, 600)
      .bbox(mapBounds);

      image.getUrl(function(err, url){
        var img = new Image();

        img.onerror = function() {
          console.warn(err);
          self.el.classList.remove('_is-loading');
        };
        img.onload  = function() {
          self.$('a').attr('style','background-image: url('+url+')');
          self.el.classList.remove('_is-loading');
        };

        img.src = url;
      });
    }
  });

})(window.App || {});
