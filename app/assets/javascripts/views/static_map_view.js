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
        layers: [{
          type: "http",
          options: {
            urlTemplate: 'https://api.mapbox.com/v4/geriux.om6jab39/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VyaXV4IiwiYSI6IkFYS1ZJdDgifQ.Md25z-4Qp3qtodl4kjTrZQ',
            subdomains: [ "a", "b", "c" ]
          }
        }]
      }
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.cartodbUser = this.options.data.cartodbUser;
      this.cartoOpt = this.options.cartoOpt;
      this.caseStudy = this.options.caseStudy;

      this._createMapImageLayer();
    },

    /**
     * Adds the image map in the case study
     * @param {Object} layer parameters
     */
    _createMapImageLayer: function() {
      var self = this;

      this.cartoOpt.user_name = this.cartodbUser;
      this.cartoOpt.layers.push({
        type: 'cartodb',
        options: {
          sql: 'SELECT * FROM barrios',
          cartocss: '#barrios{polygon-fill: #FF6600;polygon-opacity: 0.7;line-color: #FFF;line-width: 0.5;  line-opacity: 1;}',
          cartocss_version: '2.1.1'
        }
      });

      var sql = new cartodb.SQL({ user: this.cartodbUser });
      sql.getBounds('select * from barrios').done(function(bounds) {
        self._getImage(bounds);
      });

    },

    _getImage: function(bounds) {
      debugger;
      var image = cartodb.Image(this.cartoOpt)
      .size(400, 300)
      .bbox(bounds);

      image.getUrl(function(err, url){
        var img = new Image();

        img.onerror = function() {
          console.log(err);
        };
        img.onload  = function() {
          self.$('a').attr('style','background-image: url('+url+')');
        };

        img.src = url;
      });
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
    }
  });

})(window.App || {});
