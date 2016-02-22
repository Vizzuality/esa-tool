'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.MapFileCategories = Backbone.View.extend({

    defaults: { },

    columns: [],

    events: {

    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
      this.data = this._getAppData();
      this.ignored_categories = this.options.ignored_categories;
      this.columnsContainer = this.el.getElementsByClassName('box-list')[0];
      this.customColumsInput = this.el.getElementsByClassName('custom_columns_colors')[0];
      this.palette = App.CartoCSS['Theme' + this.data.caseStudy.template].palette1;
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
        var $item = $(item),
            borderColor;
        $item.spectrum({
		      showAlpha: true,
          showInput: true,
          showInitial: true,
          showPalette: true,
          showSelectionPalette: true,
          maxSelectionSize: 10,
          preferredFormat: 'rgb',
          palette: self.palette
        });
        borderColor = $(item).spectrum('get').toHex();
        $(item).siblings('.sp-replacer').css('border','1px solid #'+borderColor);

        $(item).on('change.spectrum', function(e, color){
          var borderContainer = e.currentTarget.parentElement.getElementsByClassName('sp-replacer')[0];
          borderContainer.style.border = '1px solid #'+color.toHex();
          self.updateColumnsColor();
        });
      });

    },

    getCategories: function(table, column) {
      var defer = new $.Deferred();
      var sql = new cartodb.SQL({ user: this.data.cartodbUser });
      var queryOpt = {
        column: column,
        table: table,
        limit: 15
      };
      sql.execute('SELECT DISTINCT {{column}} AS CATEGORY FROM {{table}} ORDER BY {{column}} LIMIT {{limit}}', queryOpt)
        .done(function(data) {
          if (data.rows.length){
            defer.resolve(data.rows);
          } else {
            defer.reject('there are not categories');
          }
        })
        .error(function() {
          defer.reject('fail getting categories');
        });

      return defer;
    },

    refreshCategories: function(columns) {
      var self = this;
      var colors = App.Helper.deserialize(this.customColumsInput.value);
      var paletteLenght = this.palette.length;
      var count = 0;

      _.each(columns, function(element) {
        var category, color;
        if (colors && colors[element.category]) {
          color = colors[element.category];
        } else {
          if (count > paletteLenght -1) {
            count = 0;
          }
          color = App.Helper.hexToRgba(self.palette[count], 30);
          count++;
        }
        category = self.getCategory(element.category, color);
        self.columnsContainer.insertAdjacentHTML('beforeend', category);
      });
      this.initColorPicker();
      this.columnsValues = this.$('.colorpicker');
      this.updateColumnsColor();
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

    updateColumnsColor: function() {
      this.customColumsInput.value = this.columnsValues.serialize();
    },

    _getAppData: function() {
      var data = {};

      if (gon) {
        if (gon.cartodb_user) {
          data.cartodbUser = gon.cartodb_user;
        }
        if (gon.case_study) {
          data.caseStudy = JSON.parse(gon.case_study);
        }
      }

      return data;
    },

  });

})(window.App || {});
