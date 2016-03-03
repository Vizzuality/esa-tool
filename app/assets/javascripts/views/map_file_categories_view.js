'use strict';

(function(App) {

  App.View = App.View ||  {};

  App.View.MapFileCategories = Backbone.View.extend({

    defaults: {
      rasterColumn: 'the_raster_webmercator'
    },

    columns: [],

    events: {

    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
      this.data = this._getAppData();
      this.ignored_categories = this.options.ignored_categories;
      this.rasterType = this.el.getElementsByClassName('raster-type')[0];
      this.rasterCategory = this.el.getElementsByClassName('raster-category')[0];
      this.columnsContainer = this.el.getElementsByClassName('box-list')[0];
      this.customColumsInput = this.el.getElementsByClassName('custom_columns_colors');
      this.palette = App.CartoCSS['Theme' + this.data.caseStudy.template].palette1;
    },

    start: function(column) {
      var self = this,
          promise;
      var table = this.el.getAttribute('data-table');
      column = column || this.el.getAttribute('data-column');

      this.isRaster = column === this.options.rasterColumn;
      this.columnsContainer.classList.add('_is-loading');
      this.columnsContainer.innerHTML = '';
      if (table && column) {
        if (this.isRaster) {
          promise = self.getRasterCategories(table, column);
        } else {
          promise = self.getCategories(table, column);
        }
        promise.done(function(categories) {
          self.refreshCategories(categories);
        });
        promise.fail(function(error) {
          self.handleCategoriesError(error);
        });
      } else {
        this.columnsContainer.innerHTML = 'Please choose a table column';
        this.columnsContainer.classList.remove('_is-loading');
      }
    },

    initColorPicker: function() {
      var self = this;
      $('.colorpicker').each(function(index, item) {
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
        $(item).siblings('.sp-replacer').css('border', '1px solid #' + borderColor);

        $(item).on('change.spectrum', function(e, color) {
          var borderContainer = e.currentTarget.parentElement.getElementsByClassName('sp-replacer')[0];
          borderContainer.style.border = '1px solid #' + color.toHex();
          self.updateColumnsColor();
        });
      });

    },

    getCategories: function(table, column) {
      var self = this;
      var query;
      var defer = new $.Deferred();
      var sql = new cartodb.SQL({
        user: this.data.cartodbUser
      });
      var queryOpt = {
        column: column,
        table: table,
        limit: 15
      };
      query = 'SELECT DISTINCT {{column}} AS CATEGORY FROM {{table}} ORDER BY {{column}} LIMIT {{limit}}';

      sql.execute(query, queryOpt)
        .done(function(data) {
          if (data.rows.length) {
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

    getRasterCategories: function(table, column) {
      var self = this;
      var query;
      var defer = new $.Deferred();
      var sql = new cartodb.SQL({
        user: this.data.cartodbUser
      });
      var queryOpt = {
        column: column,
        table: table,
        limit: 30
      };

      query = 'SELECT distinct (ST_ValueCount(the_raster_webmercator,1,true)).value FROM {{table}} order by value asc LIMIT {{limit}}';

      sql.execute(query, queryOpt)
        .done(function(data) {
          if (data.rows.length > 20) {
            //is a continous type raster and needs a new query
            self.getRasterContinousCat(table)
              .done(function(data) {
                defer.resolve(data);
              })
              .fail(function(error){
                defer.reject(error);
              });
          } else {
            //is a category type raster
            self.setRasterType('category');
            self.setRasterCategories(_.map(data.rows, function(item){ return item.value; }));
            var categories = _.map(data.rows, function(item){ return {'category':item.value}; });
            defer.resolve(categories);
          }
        })
        .error(function(error) {
          //trying this less expensive query
          query = 'SELECT (ST_Histogram(st_union(the_raster_webmercator),1,true,7,true)).* FROM  k_mandalay_service2_100yr_flood';
          sql.execute(query, queryOpt)
            .done(function(data) {
              var categories = [];
              _.each(data.rows, function(item){
                categories.push(item.max);
              });
              if (categories > 20) {
                //is a continous type raster and needs a new query
                self.getRasterContinousCat(table)
                  .done(function(data) {
                    defer.resolve(data);
                  })
                  .fail(function(error){
                    defer.reject(error);
                  });
              } else {
                //is a category type raster
                self.setRasterType('category');
                categories = categories.sort(function(a,b) { return a - b;});
                self.setRasterCategories(categories);
                categories = _.map(categories, function(item){ return {'category':item}; });
                defer.resolve(categories);
              }
            });
        });

      return defer;

    },

    getRasterContinousCat: function(table) {
      var self = this;
      var query;
      var defer = new $.Deferred();
      var sql = new cartodb.SQL({
        user: this.data.cartodbUser
      });
      var queryOpt = {
        table: table,
      };

      query = 'with r as ( SELECT ST_ValueCount(the_raster_webmercator) As pvc, ST_BandNoDataValue(the_raster_webmercator, 1) as noDataValue FROM {{table}} ) SELECT CDB_JenksBins(array_agg((pvc).value::numeric), 7), min((pvc).value::numeric), noDataValue  FROM r group by noDataValue';
      // query = 'with r as ( SELECT ST_ValueCount(the_raster_webmercator) As pvc, ST_BandNoDataValue(the_raster_webmercator, 1) FROM {{table}} ) SELECT CDB_JenksBins(array_agg((pvc).value::numeric), 7), min((pvc).value::numeric)  FROM r';

      sql.execute(query, queryOpt)
        .done(function(data) {
          if (data.rows[0].cdb_jenksbins.length) {

            defer.resolve(self.setRasterContinous(data));

          } else {
            defer.reject('there are not categories');
          }
        })
        .error(function() {
            defer.reject('fail getting raster continous categories');
        });

      return defer;
    },

    setRasterContinous: function(data) {
      this.setRasterType('continous');
      var categoriesArray = data.rows[0].cdb_jenksbins;
      var noDataValue = data.rows[0].nodatavalue;
      var minDataValue = data.rows[0].min;
      if (!noDataValue || noDataValue < minDataValue) {
        categoriesArray.unshift(minDataValue);
      }
      this.setRasterCategories(categoriesArray);

      return _.map(categoriesArray, function(item){ return {'category':item}; });
    },

    setRasterType: function(type) {
      this.rasterType.value = type;
    },

    setRasterCategories: function(categories) {
      this.rasterCategory.value = categories;
    },

    refreshCategories: function(columns) {
      var self = this;
      var colors = App.Helper.deserialize(this.customColumsInput[0].value);
      var paletteLenght = this.palette.length;
      var count = 0;

      _.each(columns, function(element) {
        var category, color;
        if (colors && colors[element.category]) {
          color = colors[element.category];
        } else {
          if (count > paletteLenght - 1) {
            count = 0;
          }
          color = App.Helper.hexToRgba(self.palette[count], 100);
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
      return _.template('<div class="item -color" >' +
        '<input type="text" class="colorpicker" name="<%= value %>" value="<%= color %>"> ' +
        '<span> <%= value %> </span> ' +
        ' </div>');
    },

    handleCategoriesError: function(error) {
      console.log(error);
    },

    updateColumnsColor: function() {
      var self = this;
      _.each(this.customColumsInput, function(item) {
        item.value = self.columnsValues.serialize();
      });
    },

    _getAppData: function() {
      var data = {};

      if (gon)  {
        if (gon.cartodb_user)  {
          data.cartodbUser = gon.cartodb_user;
        }
        if (gon.case_study)  {
          data.caseStudy = JSON.parse(gon.case_study);
        }
      }

      return data;
    },

  });

})(window.App ||  {});
