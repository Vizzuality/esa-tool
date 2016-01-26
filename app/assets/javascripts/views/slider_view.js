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
      fade: true,
      speed: 700,
      arrows: true,
      dots: true,
      adaptiveHeight: true,
      prevArrow: '<button type="button" class="slick-prev"></button>',
      nextArrow: '<button type="button" class="slick-next"></button>',
      responsive: [
       {
         breakpoint: 640,
         settings: {
           dots: false
         }
       }
     ]
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.$page = document.getElementById('page');
      this._setListeners();
      // At beginning initialize slick jquery plugin
      this.$el.slick(this.options);
    },

    /**
     * Function to set events at beginning
     */
    _setListeners: function() {
      this.$el
        .on('init', _.bind(this._onInit, this))
        .on('afterChange', _.bind(this._afterChange, this));
    },

    /**
     * This function will be executed when slick has been initialized
     * @param  {Event} e
     * @param  {Object} s Slick params
     */
    _onInit: function(e, s) {
      this.setCurrent(s.currentSlide);
    },

    /**
     * This function will be executed when slick has changed
     * @param  {Event} e
     * @param  {Object} s Slick params
     * @param  {Number} i Current slide
     */
    _afterChange: function(e, s, i) {
      if (i === this.current) {
        return;
      }
      this.updatePage(i);
      this._triggerChange(s, i);
      this.setCurrent(i);
    },

    /**
     * Setting current slide to this instance
     * @param {Number} i Current slide
     */
    setCurrent: function(i) {
      this.current = i;
    },

    /**
     * Go to the specified slide
     * @param  {Number} slide Slide number
     */
    goToSlide: function(slide) {
      this.$el.slick('slickGoTo', slide);
    },

    /**
     * Update the current page
     * @param  {Number} i Current slide
     */
    updatePage: function(i) {
      if (this.$page) {
        this.$page.innerHTML = i + 1;
      }
    },

    /**
     * Trigger an event when the slide has changed
     * @param  {Object} slickObject Slick params
     * @param  {Number} i           Current slide
     */
    _triggerChange: function(slickObject, i) {
      var $current = $(slickObject.$slides[i]).find('div:first');
      this.trigger('slider:page', i);
      this.trigger('slider:change', $current.data('type'));
    }

  });

})(window.App || {});
