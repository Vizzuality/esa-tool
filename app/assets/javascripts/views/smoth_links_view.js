'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.SmoothLinks = Backbone.View.extend({

    defaults: {},

    events: {
      'click .smooth-link': 'handleSmoothLink',
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});

    },

    handleSmoothLink: function(e) {
      e.preventDefault();
      var link = $(e.currentTarget).attr('href').replace(/\//g, '');
      if(link !== '#'){
        this.goToLinkSmoothly(link);
      }
      this.trigger('link:selected');
    },

    goToLinkSmoothly: function(item) {
      item = $(item);
      if (item.length){
        $('html, body').animate({
          scrollTop: $(item).offset().top - 100
        }, 300);
      }
    }

  });

})(window.App || {});
