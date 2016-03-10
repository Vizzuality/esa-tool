//= require views/search_view
//= require views/tags_filter_view

'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.Menu = Backbone.View.extend({

    defaults: {
      initialTag: false
    },

    events: {
      'click #btnBurguer': 'toggleMenu',
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.menu = document.getElementById('menu');
      this.header = document.getElementById('header');
      this.btnBurger = document.getElementById('btnBurguer');

      this._initModules();
    },

    /**
     * Function to initialize menu views
     */
    _initModules: function() {
      this._initSearch();
      this._initTagsFilter();
    },

    /**
     * Function to initialize the search box form
     */
    _initSearch: function() {
      this.search = new App.View.Search({
        el: '#casesSearch'
      });
    },

    /**
     * Function to initialize the search box form
     */
    _initTagsFilter: function() {
      this.tags = new App.View.TagsFilter({
        el: '#tagList',
        initialTag: this.options.initialTag
      });

      this.listenTo(this.tags,'tag:update', this._triggerUpdateTag);
      this.listenTo(this.tags,'menu:close', this.toggleMenu);
    },

    /**
     * Function to initialize the search box form
     */
    _triggerUpdateTag: function(tag) {
      this.trigger('tag:update', tag);
    },

    /**
     * Function to update the tag selected
     */
    updateTag: function(tag) {
      this.tags.checkSelected(tag);
    },

    /**
     * Function to open or close the navigation element
     */
    toggleMenu: function() {
      this.btnBurger.classList.toggle('_active');
      this.header.classList.toggle('_menu-open');
      this.menu.classList.toggle('_active');
    }

  });

})(window.App || {});
