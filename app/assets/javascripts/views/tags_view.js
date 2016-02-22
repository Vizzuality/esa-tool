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
      defaultText: 'Add tag',
      autocomplete_url:'/tags'
    },

    initialize: function(params) {
      var self = this;
      this.options = _.extend({}, this.defaults, params.options || {});
      this.options.autocomplete = {
        response: function( e, data ) {
          var i = data.content.length - 1;
          while (i >= 0) {
            if (self.$el.tagExist(data.content[i].label)){
              data.content.splice(i, 1);
            }
            i--;
          }
        }
      };

      this.$el.tagsInput(this.options);
    }

  });

})(window.App || {});
