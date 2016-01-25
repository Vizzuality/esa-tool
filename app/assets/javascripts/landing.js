//= require jquery2
//= require jquery_ujs
//= require slick.js/slick.js
//= require select2
//= require underscore
//= require backbone
//= require_self
//= require views/map_view
//= require views/search_view
//= require views/slider_view
//= require views/cases_filter_view
//= require controllers/map_controller
//= require collections/case_study_collection

'use strict';

(function(root) {

  var App = root.App = {
    View: {},
    Model: {},
    Controller: {},
    Collection: {},
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
      // At beginning instance slider view
      this._initModules();
    },

    /**
     * Function to initialize modules
     */
    _initModules: function() {
      this._initMap();
      this._initSlider();
      this._initSearch();
      this._initCasesFilter();
    },

    /**
     * Function to initialize the map
     */
    _initMap: function() {
      this.map = new App.View.Map({
        el: '#map',
        template: 0,
        basemap: 'satellite'
      });
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
     * Function to initialize the cases filter view
     */
    _initCasesFilter: function() {
      this.cases = new App.View.CasesFilter({
        el: '#cases'
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
    * Function to initialize the search box form
    */
    _initSearch: function() {
      this.search = new App.View.Search({
        el: '#casesSearch'
      });
    },

    /**
     * Function to open the map navigation
     * @param  {Event} e
     */
    _exploreMap: function(e) {
      this.banner.classList.add('_hidden');
      this.cases.el.classList.add('_expanded');
      this.map.el.classList.add('_expanded');
    }

  });

  function onReady() {
    new LandingView({ el: document.body });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
