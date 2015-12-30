//= require jquery2
//= require jquery_ujs
//= require slick.js/slick.js
//= require underscore
//= require backbone
//= require_self
//= require views/slider_view
//= require views/tabs_view

'use strict';

(function(root) {

  var App = root.App = {
    View: {}
  };

  var ApplicationView = Backbone.View.extend({

    events: {
      'click #btnBurguer': 'toggleMenu',
    },

    initialize: function() {
      this.menu = document.getElementById('menu');
      this.instanceModules();
    },

    instanceModules: function() {
      new App.View.Slider({
        el: '#mainSlider',
        arrows: true,
        appendArrows:'.slick-list',
        adaptiveHeight: true
      });

      this.$('.m-tabs').each(function(){
        new App.View.Tabs({
          el: this
        });
      });
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
