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
          if (data.content.length) {
            _.each(data.content, function(item, index){
              if (self.$el.tagExist(item.label)) {
                data.content.splice(index, 1);
              }
            });
          }
          return data.content;
        }
      };
      // this.getTags().done(function(data){
      //   self.tags = data.tags;
      // });
      this.$el.tagsInput(this.options);
    },

    getTags:function(){
      return $.getJSON('/tags');
    }

  });

})(window.App || {});
