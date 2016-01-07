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

  var Backoffice = Backbone.View.extend({

    events: {
      'click #saveBtn': 'submitForm'
    },

    initialize: function() {
      this.initTags();
      this.initBoxSelects();
    },

    /**
     * Initializing tags plugin
     * @param {Object}
     */
    initTags: function() {
      new App.View.Tags({
        el: this.$el.find('.tags')
      });
    },

    /**
     * Initializing box selector
     * @param {Object}
     */
    initBoxSelects: function() {
      var boxSelects = this.el.getElementsByClassName('box-selector');
      if (boxSelects && boxSelects.length) {
        new App.View.BoxSelect({ el: boxSelects });
      }
    },

    initPreviewImage: function() {
      new App.View.PreviewImage({
        el: this.el.querySelectorAll('input[type="file"]')
      });
    },

    submitForm: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      this.$el.find('form').submit();
    }

  });

  function onReady() {
    new Backoffice({ el: document.body });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
