//= require jquery2
//= require jquery_ujs
//= require slick.js/slick.js
//= require select2
//= require underscore
//= require backbone
//= require_self
//= require views/slider_view

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
      'click #exploreMap': '_exploreMap',
    },

    /**
     * This function will be executed when the instance is created
     */
    initialize: function() {
      this.menu = document.getElementById('menu');
      this.banner = document.getElementById('banner');
      this.cases = document.getElementById('cases');
      // At beginning instance slider view
      this._initSearchBox();
      this._initSlider();
    },

    /**
     * Function to initialize the searchBox
     */
    _initSearchBox: function() {
      this.search = this.$('#searchBox');
      this.search.select2();
    },

    /**
     * Function to initialize the slider
     */
    _initSlider: function() {
      this.sliderPage = 0;
      this.slider = new App.View.Slider({
        el: '#landingSlider',
        arrows: false,
        dots:true,
        responsive: [],
        autoplay: true,
        autoplaySpeed: 3000
      });
    },

    /**
     * Function to open or close the navigation element
     * @param  {Event} e
     */
    _toggleMenu: function(e) {
      e.preventDefault();
      e.currentTarget.classList.toggle('_active');
      this.menu.classList.toggle('_active');
    },

    /**
     * Function to open the map navigation
     * @param  {Event} e
     */
    _exploreMap: function(e) {
      this.banner.classList.add('_hidden');
      this.cases.classList.add('_expanded');
    }

  });

  function onReady() {
    new LandingView({ el: document.body });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
