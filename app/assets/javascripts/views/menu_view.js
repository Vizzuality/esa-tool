//= require views/search_view
//= require views/tags_filter_view

'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.Menu = Backbone.View.extend({

    defaults: {},

    events: {
      'click #btnBurguer': '_toggleMenu',
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
      this.menu = document.getElementById('menu');
      this.btnBurger = document.getElementById('btnBurguer');

      this._initModules();
    },

    /**
     * Function to initialize menu views
     */
    _initModules: function() {
      this._initSearch();
      this._initTagsFilter();
      
      this._setListeners();
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
        el: '#tagList'
      });
    },

    /**
     * Function to set child view listeners
     */
    _setListeners: function() {
      this.listenTo(this.tags,'menu:close', this._toggleMenu);
    },

    /**
     * Function to open or close the navigation element
     */
    _toggleMenu: function() {
      this.btnBurger.classList.toggle('_active');
      this.menu.classList.toggle('_active');
    }

  });

})(window.App || {});
