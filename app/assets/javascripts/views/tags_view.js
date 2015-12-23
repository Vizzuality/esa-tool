'use strict';

/**
 * TagsView use tagsinput jquery plugin
 * http://xoxco.com/projects/code/tagsinput/
 * @param {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Tags = Backbone.View.extend({

    defaults: {
      delimiter: [' ']
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.$el.tagsinput(this.options);
    }

  });

})(window.App || {});
