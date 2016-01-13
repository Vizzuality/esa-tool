'use strict';

/**
 * Map basemap selector
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.MapBasemap = Backbone.View.extend({

    events: {
      'click .basemap': '_toggleBasemap',
      'click .basemap .item': '_selectBasemap'
    },

    defaults: {
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
    },

    /**
     * Toggles the basemap menu
     * @param {Event} 
     */
    _toggleBasemap: function(ev) {
      var elem = ev.currentTarget;
      elem.classList.toggle('active');
    },

    /**
     * Selects a basemap from the menu
     * @param {Event} 
     */
    _selectBasemap: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var elem = ev.currentTarget;
      var selectedValue = elem.getAttribute('data-value');

      this._clearSelected();
      elem.classList.add('selected');

      this.trigger('basemap:set', selectedValue);
    },

    /**
     * Deselects the selected option
     */
    _clearSelected: function() {
      var previousSelected = document.querySelector('.basemap .selected');
      previousSelected.classList.remove('selected');
    },

    /**
     * Resets the view to  it's default state
     */
    _resetDefaultSelection: function() {
      var selector = document.querySelector('.basemap');
      selector.classList.remove('active');

      this._clearSelected();

      var items = document.querySelectorAll('.basemap .item');
      var firstOption = items[0];
      firstOption.classList.add('selected');
    },

    /**
     * Overwrites backbone's remove method
     */
    remove: function() {
      this._resetDefaultSelection();
      this.undelegateEvents();
    }

  });

})(window.App || {});
