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
      interval: 4000
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.data = this.options.data;
      this.interval = this.options.interval;
      this.selectedYear= this.options.currentYear;
      this.isPlaying = false;

      this._start();
    },

    _start: function() {
      this.years = _.uniq(_.pluck(this.data, 'year'));
    },

    _togglePlay: function() {
      if (!this.isPlaying) {
        console.log('play');
        this._play();
      } else {
        console.log('pause');
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

    _changeYear: function() {
      var current = this.selectedYear;
      var years = _.clone(this.years);
      var numYears = years.length - 1;
      var currentPos = years.indexOf(current);
      
      currentPos++;

      if (currentPos > numYears) {
        currentPos = 0;
      }
      
      var newYear = years.slice(currentPos, (currentPos + 1));
      newYear = newYear.toString();
      this.selectedYear = newYear;
      this.trigger('timeline:change:year', newYear);
    },

    remove: function() {
      this.undelegateEvents();
      this.stopListening();
      this.remove();
    }

  });

})(window.App || {});