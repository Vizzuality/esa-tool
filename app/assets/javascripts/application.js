//= require jquery2
//= require jquery_ujs
//= require slick.js/slick.js
//= require underscore
//= require backbone
//= require leaflet
//= require_self
//= require views/slider_view
//= require views/map_view
//= require views/tabs_view

'use strict';

(function(root) {

  var App = root.App = {
    View: {},
    Events: _.clone(Backbone.Events)
  };

  var ApplicationView = Backbone.View.extend({

    events: {
      'click #btnBurguer': '_toggleMenu',
    },

    /**
     * This function will be executed when the instance is created
     */
    initialize: function() {
      this.menu = document.getElementById('menu');
      // At beginning instance slider view
      this.slider = new App.View.Slider({ el: '#mainSlider' });
      this._setListeners();
    },

    /**
     * Function to set events at beginning
     */
    _setListeners: function() {
      this.listenTo(this.slider, 'slider:change', this.initMap);
    },

    /**
     * When the type of slide is 'map' the map view will be initialized
     * else the map will be removed to improve the performance.
     * @param  {String} slideType It could be cover, text or map
     */
    initMap: function(slideType) {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
      if (slideType === 'map') {
        this.map = new App.View.Map({ el: '#mapView' });
      }
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
    new ApplicationView({ el: document.body });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
