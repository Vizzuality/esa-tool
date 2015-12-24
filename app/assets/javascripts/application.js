//= require jquery2
//= require jquery_ujs
//= require slick.js/slick.js
//= require underscore
//= require backbone
//= require_self
//= require views/slider_view

'use strict';

(function(root) {

  var App = root.App = {
    View: {}
  };

  var ApplicationView = Backbone.View.extend({

    events: {
      'click #btnBurguer': 'toggleMenu'
    },

    initialize: function() {
      this.menu = document.getElementById('menu');
      new App.View.Slider({ el: '#mainSlider' });
    },

    toggleMenu: function(e) {
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
