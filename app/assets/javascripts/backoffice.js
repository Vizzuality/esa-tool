//= require jquery2
//= require jquery_ujs
//= require jquery-ui.min.js
//= require cocoon
//= require jquery.tagsinput/jquery.tagsinput
//= require featherlight
//= require spectrum.js
//= require underscore
//= require backbone
//= require_self
//= require helpers/helper
//= require_tree ./cartocss
//= require views/tags_view
//= require views/box_select_view
//= require views/image_views
//= require views/map_file_columns_view
//= require views/map_file_categories_view

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
      this.initImageView();
      this.initMapFileColumns();
      this.initFeatherlight();
      this.setExitWithoutSavingConfirmation();
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

    initImageView: function() {
      new App.View.ImageViews({
        el: this.el.querySelectorAll('.file-image-input')
      });
    },

    initMapFileColumns: function() {
      this.filesContainer = document.getElementsByClassName('file-map-input');
      _.each(this.filesContainer, function(item) {
        new App.View.MapFileColumns({
          el: item
        });
      });
    },

    submitForm: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      this.submitted = true;
      e.currentTarget.parentNode.classList.add('_is-loading');
      this.$el.find('form').submit();
    },

    initFeatherlight: function(){
      $.featherlight.defaults.otherClose = "button.-close, .uploaded-images";
      $.featherlight.defaults.afterContent = function(){
        this.$content.after('<div class="featherlight-actions _center"><button class="btn -primary -close"> Back </button></div>');
      };
    },

    setExitWithoutSavingConfirmation: function(){
      var self = this;
      this.submitted = false;
      this.form = this.$("form.exit-saving");
      this.cleanForm = this.form.serialize();
      $(window).on('beforeunload', function(e){
        e = e || window.event;
        if(!self.submitted && self.cleanForm != self.form.serialize()) {
          // For IE and Firefox
          if (e) {
            e.returnValue = "You have unsaved changes.";
          }
          // For Safari
          return "You have unsaved changes.";
        }
      });
    }

  });

  function onReady() {
    new Backoffice({ el: document.body });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
