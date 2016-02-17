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
      this.customColumsInput = this.el.getElementsByClassName('custom_columns_colors')[0];
    },

    init: function(column) {
      var self = this
      var table = this.el.getAttribute('data-table');
      column = column || this.el.getAttribute('data-column');
      this.columnsContainer.classList.add('_is-loading');
      this.columnsContainer.innerHTML = '';
      if (table && column) {
        var promise = self.getCategories(table, column);
        promise.done(function(categories){
          self.refreshCategories(categories);
        });
        promise.fail(function(error){
          self.handleCategoriesError(error);
        });
      } else {
        this.columnsContainer.innerHTML = 'Please choose a table column';
        this.columnsContainer.classList.remove('_is-loading');
      }
    },

    initColorPicker: function() {
      var self = this;
      $('.colorpicker').each(function(index, item){
        var $item = $(item);
        $item.spectrum({
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

        $(item).on('change.spectrum', function(e, color){
          self.updateColumnsColor(color);
        });
      });

    },

    getCategories: function(table, column) {
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
      var colors = this.deserialize(this.customColumsInput.value);

      _.each(columns, function(element) {
        if (colors) {
          self.columnsContainer.insertAdjacentHTML('afterbegin', self.getCategory(element.category, colors[element.category]));
        } else {
          // TODO add palette of theme
          self.columnsContainer.insertAdjacentHTML('afterbegin', self.getCategory(element.category, '#fff'));
        }
      });
      this.initColorPicker();
      this.columnsValues = this.$('.colorpicker');
      this.columnsContainer.classList.remove('_is-loading');
    },

    getCategory: function(element, color) {
      var category = {
        value: element,
        color: color
      };
      return this._categoryTemplate()(category);
    },

    _categoryTemplate: function() {
      return _.template('<div class="item -color" >'+
                          '<input type="text" class="colorpicker" name="<%= value %>" value="<%= color %>"> '+
                          '<span> <%= value %> </span> '+
                        ' </div>');
    },

    handleCategoriesError: function(error) {
      console.log(error);
    },

    updateColumnsColor: function(color) {
      this.customColumsInput.value = this.columnsValues.serialize();
    },

    deserialize: function(string) {
      var obj = {},
          fields = [];
      string = string.replace(/\+/g, '%20');

      if (string){
        fields = string.split('&');

        _.each(fields, function(item){
          var nameValue = item.split('=');
          var name = decodeURIComponent(nameValue[0]);
          var value = decodeURIComponent(nameValue[1]);
          obj[name] = value;
        });
        return obj;
      } else {
        return null;
      }
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
