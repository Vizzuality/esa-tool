//= require jquery2
//= require jquery_ujs
//= require jquery.validate.js
//= require slick.js/slick.js
//= require select2.js
//= require underscore
//= require backbone
//= require_self
//= require router
//= require views/map_view
//= require views/smoth_links_view
//= require views/menu_view
//= require views/contact_form_view
//= require views/static_map_view
//= require views/cases_list_view
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
      'click #exploreMap': '_exploreMap',
    },

    /**
     * This function will be executed when the instance is created
     */
    initialize: function() {
      this.data = this._getAppData();
      this.banner = document.getElementById('banner');

      this._initRouter();
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
     * Function to initialize the router
     */
    _initRouter: function() {
      this.router = new root.App.Router();

      this.listenTo(this.router, 'start:landing', _.bind(this._initModules, this));

      this.router.start();
    },

    /**
    * Function to initialize modules
    */
    _initModules: function(tag) {
      this._initMenu(tag);
      this._initCasesFilter(tag);
      this._initSmoothLinks();
      this._initCasesList();
      this._initMap();
      this._initContactForm();
    },

    /**
     * Function to initialize the menu
     */
    _initMenu: function(tag) {
      this.menu = new App.View.Menu({
        el: document.body,
        initialTag: tag
      });

      this.listenTo(this.menu, 'tag:update', _.bind(this._updateRouter, this));
    },

    toggleMenu: function(){
      this.menu.toggleMenu();
    },

    /**
     * Function to initialize the menu
     */
    _initSmoothLinks: function() {
      this.links = new App.View.SmoothLinks({
        el: document.body
      });
      var section = Backbone.history.getFragment();
      if (section) {
        this.links.goToLinkSmoothly('#'+section);
      }
      this.listenTo(this.links, 'link:selected', _.bind(this.toggleMenu, this));
    },

    _initCasesList: function() {
      this.casesList = new App.View.CasesList({
        el: '#cases',
        data: this.data
      });

      var caseStudies = this.data.caseStudies;
      this.casesList.staticMapsView(caseStudies);

      this.listenTo(this.cases, 'list:update', this.casesList.staticMapsView.bind(this.casesList));
    },

    /**
     * Function to initialize the landing
     */
    _initCasesFilter: function(tag) {
      this.cases = new App.View.CasesFilter({
        el: '#cases',
        initialTag: tag,
        data: this.data
      });

      this.listenTo(this.cases, 'tag:update', _.bind(this._updateRouter, this));
      this.listenTo(this.router, 'rooter:updated', _.bind(this._updateTag, this));
    },

    /**
     * Function to initialize the map
     */
    _initMap: function() {
      var southWest = L.latLng(85, -180),
          northEast = L.latLng(-85, 180),
          bounds = L.latLngBounds(southWest, northEast);
      this.map = new App.View.Map({
        el: '#map',
        template: 0,
        basemap: 'satellite',
        maxBounds: bounds,
        minZoom: 3
      });
    },

    /**
     * Function to initialize the map cases location
     */
    _renderCases: function() {
      var self = this;
      var markers = [];
      var myIcon = L.divIcon({
        className: 'marker',
        iconSize: [12, 12],
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
          markers.push([caseStudy.lat,caseStudy.lng]);
        }
      });

      var bounds = L.latLngBounds(markers);
      this.map.fitBounds(bounds, {
        animate: true,
        maxZoom: 5
      });
    },

    /**
     * Function to get the popup case
     */
    _popUpTemplate: function(caseStudy) {
      return  '<div class="content"><p>'+caseStudy.title+'</p>'+
                '<a class="link" href='+caseStudy.case_path+'> Learn more </>'+
              '</div>';
    },

    /**
     * Function to initialize the contact form events handler
     */
    _initContactForm: function() {
      this.contactFormEl = $('#contact-form');
      this.contactFormEl.find('form').validate();
      this.contactForm = new App.View.ContactForm({
        el: this.contactFormEl,
      });
    },

    /**
     * Function to initialize the cases filter view
     */
    _updateRouter: function(tag) {
      var params = {
        name: this.cases.filterName,
        value: tag
      };
      this.router.trigger('route:updateParam', params);
    },

    /**
     * Function to update the tag filter
     */
    _updateTag: function(tag) {
      this.cases.updateTag(tag);
      this.menu.updateTag(tag);
    },

    /**
     * Function to open the map navigation
     * @param  {Event} e
     */
    _exploreMap: function() {
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
