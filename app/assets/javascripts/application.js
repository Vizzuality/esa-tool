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
    this.el = document.body;
    new App.View.Slider({ el: '#mainSlider' });
    setListeners();
  }

  function setListeners() {
    var menuBtn = document.getElementsByClassName('btn-burguer');
    menuBtn[0].addEventListener('click', toggleMobileMenu);
  }

  function toggleMobileMenu() {
    document.body.classList.toggle('mobile-menu-open');
    this.classList.toggle('-open');
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
