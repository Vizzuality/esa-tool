'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.MapFileCategories = Backbone.View.extend({

    defaults: {
      ignored_categories: [
        'cartodb_id',
        'the_geom',
        'the_geom_webmercator',
        'updated_at',
        'created_at',
        'year'
      ]
    },

    columns: [],

    events: {

    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
      this.data = this._getAppData();
      this.ignored_categories = this.options.ignored_categories;
      this.columnsContainer = this.el.getElementsByClassName('box-list')[0];
    },

    init: function(column) {
      var self = this
      var table = this.el.getAttribute('data-table');
      column = column || this.el.getAttribute('data-column');
      this.columnsContainer.classList.add('_is-loading');
      this.columnsContainer.innerHTML = '';

      var promise = self.getCategories(table, column);
      promise.done(function(categories){
        self.refreshCategories(categories);
      });
      promise.fail(function(error){
        self.handleCategoriesError(error);
      });
    },

    initColorPicker: function() {
      $('.colorpicker').each(function(index, item){
        $(item).spectrum({
          showInput: true,
          showInitial: true,
          showPalette: true,
          showSelectionPalette: true,
          maxSelectionSize: 10,
          preferredFormat: 'hex',
          palette: [
            '#2B7312',
            '#FF6600',
            '#229A00',
            '#7801FF',
            '#EA01FF',
            '#FF0060',
            '#FF6602',
            '#ffc600'
          ]
        });
      });

    },

    getCategories: function(table, column) {
      var self = this;
      var query = 'SELECT DISTINCT ' + column +' AS CATEGORY FROM ' + table + ' LIMIT 15';
      var defer = new $.Deferred();
      $.getJSON('https://'+this.data.cartodb_user+'.cartodb.com/api/v2/sql/?q='+query)
        .done(function(data){
          if (data.rows.length){
            defer.resolve(data.rows);
          } else {
            defer.reject('there are not categories');
          }
        }).fail(function(){
          defer.reject('fail getting categories');
        });

      return defer;
    },

    refreshCategories: function(columns) {
      var self = this;
      var color = '#2B7312'
      _.each(columns, function(element) {
        self.columnsContainer.insertAdjacentHTML('afterbegin', self.getCategory(element, color));
      });
      this.initColorPicker();
      this.columnsContainer.classList.remove('_is-loading');
    },

    getCategory: function(element, color) {
      var column = {
        value: element.category,
        color: color
      };
      return this._columnTemplate()(column);
    },

    _columnTemplate: function() {
      return _.template('<div class="item -color" >'+
                          '<input type="text" class="colorpicker" name="<%= value %>" value="<%= color %>"> '+
                          '<span> <%= value %> </span> '+
                        ' </div>');
    },

    handleCategoriesError: function(error) {
      console.log(error);
    },

    _getAppData: function() {
      var data = {};

      if (gon && gon.cartodb_user) {
        data.cartodb_user = gon.cartodb_user;
      }

      return data;
    },

  });

})(window.App || {});
