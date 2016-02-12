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

      this.cartoOpt.layers = [];
      this.cartoOpt.layers.push(this.basemap);

      this.cartoOpt.user_name = this.cartodbUser;
      this.cartoOpt.layers.push({
        type: 'cartodb',
        options: {
          sql: 'SELECT * FROM ' + layer.table_name,
          cartocss: '#' + layer.table_name + '{polygon-fill: #ccc; ' +
            'polygon-opacity: 0.1;line-color: #FFF; ' +
            'line-width: 0.9;line-opacity: 0.2 ;}',
          cartocss_version: '2.1.1'
        }
      });

      var optsC = _.extend({}, self.cartoOpt);
      var sql = new cartodb.SQL({ user: this.cartodbUser });
      sql.getBounds('SELECT * FROM ' + layer.table_name).done(function(bounds) {
        self._getImage(optsC, bounds);
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
