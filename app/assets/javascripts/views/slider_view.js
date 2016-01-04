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
      appendArrows:'.slick-list',
      adaptiveHeight: true,
      prevArrow:'<button type="button" class="slick-prev">Prev.</button>',
      nextArrow:'<button type="button" data-first-label="VIEW CASE" class="slick-next">Prev.</button>'
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.setListeners();
      this.$el.slick(this.options);
    },

    setListeners: function() {
      var self = this;
      this.$el.on('init', function(){
        this.classList.add('-first');
      });
      this.$el.on('afterChange', function(event, slick, currentSlide){
        if (currentSlide === 0) {
          this.classList.add('-first');
        } else {
          this.classList.remove('-first');
        }
        if (currentSlide === slick.slideCount -1) {
          this.classList.add('-last');
        } else {
          this.classList.remove('-last');
        }
      });
    }

  });

})(window.App || {});
