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
      speed: 150,
      arrows: true,
      adaptiveHeight: true,
      prevArrow: '<button type="button" class="slick-prev"></button>',
      nextArrow: '<button type="button" class="slick-next"></button>'
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.$page = document.getElementById('page');
      this.setListeners();
      this.$el.slick(this.options);
    },

    setListeners: function() {
      var _this = this;
      this.$el.on('afterChange', function(e, s, currentSlide) {
        _this.$page.innerHTML = currentSlide + 1;
      });
    }

  });

})(window.App || {});
