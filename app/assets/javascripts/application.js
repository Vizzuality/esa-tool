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

  function onReady() {
    new App.View.Slider({ el: '#mainSlider' });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
