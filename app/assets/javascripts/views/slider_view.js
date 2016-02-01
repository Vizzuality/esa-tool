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
     ],
     initialSlide: 0
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.$page = document.getElementById('page');
      this.menu = document.getElementById('menu');
      this._setListeners();
    },

    /**
     * Function to start slider
     * @param  {Object} params
     */
    start: function(params) {
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
      var self = this;
      this.setCurrent(s.currentSlide);
      self.trigger('slider:initialized');

      this.$('.slick-dots').on('click', _.bind(this._checkMenu, this));
      // setTimeout(function () {
      // }, 1);
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
     * Check if menu is opened to close it
     * @param  {Number} i Current slide
     */
    _checkMenu: function() {
      if (this.menu.classList.contains('_active')) {
        this.trigger('menu:close');
      }
    },

    /**
     * Trigger an event when the slide has changed
     * @param  {Object} slickObject Slick params
     * @param  {Number} i           Current slide
     */
    _triggerChange: function(slickObject, i) {
      this.trigger('slider:page', i);
      this.trigger('slider:change');
    }

  });

})(window.App || {});
