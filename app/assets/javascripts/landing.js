//= require jquery2
//= require jquery_ujs
//= require slick.js/slick.js
//= require underscore
//= require backbone
//= require_self

'use strict';

(function(root) {

  var App = root.App = {
    View: {},
    Model: {},
    Controller: {},
    Events: _.clone(Backbone.Events)
  };

  var LandingView = Backbone.View.extend({

    events: {
      'click #btnBurguer': '_toggleMenu',
    },

    /**
     * This function will be executed when the instance is created
     */
    initialize: function() {
      this.menu = document.getElementById('menu');
      // At beginning instance slider view
      // this._initSlider();
    },

    /**
     * Function to initialize the slider
     */
    _initSlider: function() {
      this.sliderPage = 0;
      this.slider = new App.View.Slider({ el: '#mainSlider' });
    },

    /**
     * Function to open or close the navigation element
     * @param  {Event} e
     */
    _toggleMenu: function(e) {
      e.preventDefault();
      e.currentTarget.classList.toggle('_active');
      this.menu.classList.toggle('_active');
    }

  });

  function onReady() {
    new LandingView({ el: document.body });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
