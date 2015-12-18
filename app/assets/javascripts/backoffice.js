//= require jquery2
//= require jquery_ujs
//= require cocoon
//= require tagsinput
//= require underscore
//= require backbone
//= require_self
//= require views/tags_view
//= require views/box_select_view
//= require views/preview_image_view

'use strict';

(function(root) {

  var App = root.App = {
    View: {}
  };

  function onReady() {

    this.el = document.body;

    /**
     * Initializing tags plugin
     * @param {Object}
     */
    new App.View.Tags({
      el: this.el.getElementsByClassName('tags')
    });

    /**
     * Initializing box selector
     * @param {Object}
     */
    new App.View.BoxSelect({
      el: this.el.getElementsByClassName('box-selector')
    });

    new App.View.PreviewImage({
      el: this.el.querySelectorAll('input[type="file"]')
    });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
