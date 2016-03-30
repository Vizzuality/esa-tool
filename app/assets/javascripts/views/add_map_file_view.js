'use strict';

/**
 * TagsView use tagsinput jquery plugin
 * http://xoxco.com/projects/code/tagsinput/
 * @param {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.AddMapFile = Backbone.View.extend({

    events: {
      'cocoon:before-insert': 'handleBeforeNewLayer',
      'cocoon:after-insert': 'handleAfterNewLayer'
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
      // this.$('.add_fields')
      //   .data('association-insertion-method', 'append')
      //   .data('association-insertion-node', function(link){
      //     debugger;
      //     return link;
      //   });
    },

    handleBeforeNewLayer: function(e, item) {
      e.preventDefault();
      item.hide();
    },

    handleAfterNewLayer: function(e, item) {
      e.preventDefault();
      this.trigger('file:added', 'New layer', item);
      new App.View.MapFileUpload({
        el: item
      });
    }
  });

})(window.App || {});
