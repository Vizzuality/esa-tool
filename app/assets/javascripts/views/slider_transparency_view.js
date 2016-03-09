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

    onSliderChange: function(event, ui) {
      this.trigger('slider:changed', ui.value);
    }

  });

})(window.App || {});
