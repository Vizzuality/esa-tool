'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.SliderTransparency = Backbone.View.extend({

    defaults: { },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.$el.slider({
        value: 100,
        create: this.setListeners.bind(this)
      });
    },

    setListeners: function() {
      this.$el.on('slide', this.onSliderChange.bind(this));
    },

    unsetListeners: function() {
      this.$el.off('slide', this.onSliderChange.bind(this));
    },

    onSliderChange: function(event, ui) {
      this.trigger('slider:changed', ui.value);
    },

    /**
     * Overwrites backbone's remove method
     */
    remove: function() {
      this.$el.slider('destroy');
      this.unsetListeners();
    }

  });

})(window.App || {});
