//= require jquery2
//= require jquery_ujs
//= require jquery-ui.min.js
//= require jquery.validate.js
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
//= require views/tabs_view
//= require views/box_select_view
//= require views/image_views
//= require views/logo_collection_view
//= require views/add_map_file_view
//= require views/map_file_upload_view
//= require views/map_file_status_view
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
      this.initTabs();
      this.initBoxSelects();
      this.initImageView();
      this.initMapFileStatus();
      this.initMapFileUpload();
      this.initAddMapFile();
      this.initMapFileColumns();
      this.initFeatherlight();
      this.initValidation();
      this.setExitWithoutSavingConfirmation();
      this.setListeners();
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
     * Initializing tabs plugin
     * @param {Object}
     */
    initTabs: function() {
      this.tabs = new App.View.Tabs({
        el: window.document
      });
    },

    /**
     * Initializing box selector
     * @param {Object}
     */
    initBoxSelects: function() {
      this.boxSelects = this.el.getElementsByClassName('box-selector');

      if (this.boxSelects && this.boxSelects.length) {
        _.each(this.boxSelects, function(item) {
          new App.View.BoxSelect({
            el: item
          });
        });
      }
    },

    initImageView: function() {
      this.images = new App.View.ImageViews({
        el: this.el.querySelectorAll('.file-image-input')
      });
      this.logoCollection = new App.View.LogoCollectionView({
        el: this.el
      });
      this.listenTo(this.logoCollection, 'logo:opened', this.setCurrentInput);
      this.listenTo(this.logoCollection, 'logo:selected', this.setLogoSelected);
    },

    setCurrentInput: function(id) {
      this.currentInputId = id;
    },

    setLogoSelected: function(data) {
      this.images.setLogo(this.currentInputId, data);
    },

    initMapFileStatus: function() {
      this.caseStudyPage = document.getElementById('caseStudyPage');
      // Data type 2 and 3 is timeline and map type
      if (this.caseStudyPage &&
          (this.caseStudyPage.getAttribute('data-type')==='2' ||
           this.caseStudyPage.getAttribute('data-type')==='3') ) {
        new App.View.MapFileStatus({
          el: this.caseStudyPage
        });
      }
    },

    initAddMapFile: function() {
      this.addFiles = new App.View.AddMapFile({
        el: document.getElementsByClassName('add-file-cocoon')
      });
      this.listenTo(this.addFiles, 'file:added', this.onFileAdded);
    },

    onFileAdded: function(title, content) {
      this.tabs.addTab(title, content);
    },

    initMapFileColumns: function() {
      this.filesContainer = document.getElementsByClassName('file-map-input');
      _.each(this.filesContainer, function(item) {
        new App.View.MapFileColumns({
          el: item
        });
      });
    },

    initMapFileUpload: function() {
      this.filesUpload = document.getElementsByClassName('file-map-upload');
      _.each(this.filesUpload, function(item) {
        new App.View.MapFileUpload({
          el: item
        });
      });
    },

    submitForm: function(e) {
      var form = $( 'form' );
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      if (form.valid()) {
        this.submitted = true;
        e.currentTarget.parentNode.classList.add('_is-loading');
        this.$el.find('form').submit();
      }
    },

    initFeatherlight: function(){
      $.featherlight.defaults.otherClose = "button.-close, .uploaded-images";
      $.featherlight.defaults.afterContent = function(){
        this.$content.after('<div class="featherlight-actions _center"><button class="btn -primary -close -closeform"> Back </button><button class="btn -primary -saveform" style="display:none"> Save </button></div>');
      };
    },

    initValidation: function(){
      var headerHeight = 0;
      $('header').each(function(idex, item){
        headerHeight += item.offsetHeight;
      });
      $('form').validate({
        focusInvalid: false,
        invalidHandler: function(form, validator) {
          var errorPosTop = $(validator.errorList[0].element).offset().top - headerHeight - 20;
          $('html, body').animate({
            scrollTop: errorPosTop
          }, 500);

        }
      });
    },

    setExitWithoutSavingConfirmation: function(){
      var self = this;
      this.submitted = false;
      this.form = this.$('form.exit-saving');
      this.cleanForm = this.form.serialize();
      $(window).on('beforeunload', function(e){
        e = e || window.event;
        if(!self.submitted && self.cleanForm !== self.form.serialize()) {
          // For IE and Firefox
          if (e) {
            e.returnValue = 'You have unsaved changes.';
          }
          // For Safari
          return 'You have unsaved changes.';
        }
      });
      Backbone.Events.on('refresh:force', function(){
        $(window).off('beforeunload');
        location.reload();
      });
    },

    setListeners: function(){
      this.$('#addContact').on('cocoon:after-insert', _.bind(this.initImageView, this));
    }

  });

  function onReady() {
    new Backoffice({ el: document.body });
  }

  document.addEventListener('DOMContentLoaded', onReady);

})(window);
