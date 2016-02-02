'use strict';

/**
 * Timeline view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Timeline = Backbone.View.extend({

    events: {
      'click .action': '_togglePlay'
    },

    defaults: {
      interval: 3000
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.interval = this.options.interval;
      this.isPlaying = false;
    },

    start: function(params) {
      this.data = params.data;
      this.years = _.uniq(_.pluck(this.data, 'year'));
    },

    _togglePlay: function() {
      if (!this.isPlaying) {
        this._play();
      } else {
        this._pause();
      }
    },

    _play: function() {
      var self = this;
      this.isPlaying = true;

      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }

      this.playInterval = setInterval(function() {
        self._changeYear();
      }, this.interval);
    },

    _pause: function() {
      this.isPlaying = false;

      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }
    },

    updateState: function(params) {
      this.layersLoaded = params.layersLoaded;
      this.selectedYear = params.currentYear;
    },

    _changeYear: function() {
      if (this.layersLoaded) {
        var current = this.selectedYear.toString();
        var years = _.clone(this.years);
        var numYears = years.length - 1;
        var currentPos = years.indexOf(current);
        
        currentPos++;

        if (currentPos > numYears) {
          currentPos = 0;
        }
        
        var newYear = years.slice(currentPos, (currentPos + 1));
        newYear = parseInt(newYear, 10);
        this.selectedYear = newYear;
        this.layersLoaded = false;
        this.trigger('timeline:change:year', newYear);
      }
    },

    remove: function() {
      this.undelegateEvents();
      this.stopListening();
      this.remove();
    }

  });

})(window.App || {});