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

    /**
     * Sets the data for the view
     * @param  {Object} params
     */
    start: function(params) {
      this.data = params.data;
      this.years = _.uniq(_.pluck(this.data, 'year'));
    },

    /**
     * Shows the UI of the view
     */
    show: function() {
      this.el.classList.add('enabled');
      this.el.classList.remove('disabled');
    },

    /**
     * Hides the UI of the view
     */
    hide: function() {
      var button = this.el.querySelector('.action');
      button.classList.remove('playing');
      button.classList.add('paused');

      this.el.classList.remove('enabled');
      this.el.classList.add('disabled');
    },

    /**
     * Toggles the play / pause functionality
     * @param {Object} event
     */
    _togglePlay: function(ev) {
      var elem = ev.currentTarget;

      if (!this.isPlaying) {
        this._play();
        elem.classList.remove('paused');
        elem.classList.add('playing');
      } else {
        this._pause();
        elem.classList.remove('playing');
        elem.classList.add('paused');
      }
    },

    /**
     * Starts the timeline animation
     */
    _play: function() {
      var self = this;
      this.isPlaying = true;

      this._resetInterval();

      this.playInterval = setInterval(function() {
        self._changeYear();
      }, this.interval);
    },

    /**
     * Stops the timeline animation
     */
    _pause: function() {
      this.isPlaying = false;

      this._resetInterval();
    },

    /**
     * Updates the state of the view
     * @param {Object} parameters
     */
    updateState: function(params) {
      this.layersLoaded = params.layersLoaded;
      this.selectedYear = params.currentYear;
    },

    /**
     * Changes the year and triggers the event
     */
    _changeYear: function() {
      if (this.layersLoaded) {
        var current = this.selectedYear;
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

    /**
     * Resets the animaton interval
     */
    _resetInterval: function() {
      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }
    },

    /**
     * Unsets the events and animation
     */
    remove: function() {
      this.hide();
      this._pause();
      this.undelegateEvents();
      this.stopListening();
    }
  });

})(window.App || {});