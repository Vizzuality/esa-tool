'use strict';

/**
 * Timeline view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Timeline = Backbone.View.extend({

    events: {
    },

    defaults: {
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.data = this.options.data;

      this._render();
    },

    _render: function() {
      var self = this;
      var years = _.keys(this.data);
      
      _.each(years, function(year) {
        self._addYearToTimeline(year);
      });
    },

    _addYearToTimeline: function(year) {
      var container = this.el.querySelector('.list');
      var yearElement = document.createElement('li');
      var yearText = document.createTextNode(year);

      yearElement.appendChild(yearText);
      yearElement.classList.add('item');
      container.appendChild(yearElement);
    },

    remove: function() {
      this._unsetListeners();
    }

  });

})(window.App || {});