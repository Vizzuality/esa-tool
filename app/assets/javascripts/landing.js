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
      this.data = this._getAppData();
      this.menu = document.getElementById('menu');
      this.banner = document.getElementById('banner');
      // At beginning instance slider view
      this._initModules();
    },

    /**
     * Function to initialize modules
     */
    _getAppData: function() {
      var data = {};

      if (gon && gon.case_studies) {
        data.caseStudies = JSON.parse(gon.case_studies);
      }

      if (gon && gon.cartodb_user) {
        data.cartodbUser = gon.cartodb_user;
      }

      return data;
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
     * Function to initialize the map
     */
    _renderCases: function() {
      var self = this;
      var myIcon = L.divIcon({
        className: 'marker',
        iconSize: [10, 10],
      });
      var markerOptions = {
        icon:myIcon
      };
      _.each(this.data.caseStudies, function(caseStudy){
        if (caseStudy.lat && caseStudy.lng){
          self.map.createMarker(
            [caseStudy.lat,caseStudy.lng],
            markerOptions,
            self._popUpTemplate(caseStudy)
          );
        }
      });
    },

    /**
     * Function to initialize the map
     */
    _popUpTemplate: function(caseStudy) {
      return  '<div class="content"><p>'+caseStudy.title+'</p>'+
                '<a class="link" href='+'#'+'> Learn more </>'+
              '</div>';
    },

    /**
     * Function to initialize the slider
     */
    _initSlider: function() {
      this.slider = new App.View.Slider({
        el: '#landingSlider',
        arrows: false,
        dots:true,
        responsive: [],
        autoplay: true,
        autoplaySpeed: 3000
      });
      this.slider.start();
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

      this._renderCases();
    }

  });

  function onReady() {
    new LandingView({ el: document.body });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
