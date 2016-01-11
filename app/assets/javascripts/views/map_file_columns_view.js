'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.MapFileColumns = Backbone.View.extend({

    defaults: {
      ignored_columns: ['cartodb_id','the_geom','the_geom_webmercator']
    },

    columns: [],

    events: {
      'change': 'inputChanged'
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
      this.ignored_columns = this.options.ignored_columns;
    },

    inputChanged: function(e) {
      var self = this;
      var promise = self.getColumns();
      promise.done(function(){
        self.refreshColumns();
      });
      promise.fail(function(error){
        self.handleColumnsError(error);
      });
    },

    getColumns: function(e) {
      var self = this;
      var query = 'SELECT * FROM public LIMIT 0';
      var defer = new $.Deferred();
      $.getJSON('https://'+'j8seangel'+'.cartodb.com/api/v2/sql/?q='+query)
        .done(function(data){
          $.each(data.fields, function(key, val) {
            if (!_.contains(self.ignored_columns, key)) {
              self.columns.push(key);
            }
          });
          if (self.columns.length){
            defer.resolve();
          } else {
            defer.reject('there are not columns');
          }
        }).fail(function(){
          defer.reject('fail getting columns');
        });

      return defer;
    },

    refreshColumns: function() {
      var self = this;
      console.log('TODO draw columns:' self.columns.length);
    },

    handleColumnsError: function(error) {
      console.log(error);
    }

  });

})(window.App || {});
