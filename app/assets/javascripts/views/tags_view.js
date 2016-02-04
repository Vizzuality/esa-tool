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
      width: '100%',
      height: 'auto',
      defaultText: 'Add tag'
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
      this.$el.tagsInput(this.options);
    }

  });

})(window.App || {});
