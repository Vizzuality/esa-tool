'use strict';

/**
 * Slick View use jquery plugin
 * http://kenwheeler.github.io/slick/
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Slider = Backbone.View.extend({

    defaults: {
      infinite: false,
      speed: 150
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.$el.slick(this.options);
    }

  });

})(window.App || {});
