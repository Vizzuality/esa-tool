//= require views/map_file_categories_view

'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.MapFileColumns = Backbone.View.extend({

    defaults: {
      ignored_columns: [
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
      'change #map_file': 'onInputChanged',
      'click .close': 'removeFileSelected',
      'click .item': 'onClickItem',
      'cocoon:after-insert': 'onAddNewItem',
      'cocoon:after-remove': 'onRemoveNewItem'
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});

      this.data = this._getAppData();
      this.ignored_columns = this.options.ignored_columns;

      if (this.el.querySelectorAll('[data-filename]').length){
        this.list = this.el.querySelectorAll('[data-filename]')[0];
        this.layerId = this.list.getAttribute('data-layerid');
        this.fileName = this.list.getAttribute('data-filename');
        this.init();
      }

    },

    init: function() {
      var self = this;

      if (this.list){
        this.category = new App.View.MapFileCategories({
          el: document.getElementById('custom-column-layer-'+this.layerId)
        });
        this.category.init();
      }

      var promise = self.getColumns(this.fileName);
      promise.done(function(columns){
        self.refreshColumns(columns);
      });
      promise.fail(function(error){
        self.handleColumnsError(error);
      });

    },

    onInputChanged: function(e) {
      var self = this;
      var file = e.currentTarget.files[0];
      var extension = file.name.substr(file.name.lastIndexOf('.')+1);
      if (extension === "csv"){

        // var columns = self.getColums(file);
        // columns.done(function(columns){
        //   if (columns.indexOf('year') === -1) {
        //     alert('The selected shapefile file doesn\'t contain the year column');
        //     self.removeFileSelected();
        //   } else {
        //     self.addFileSelected();
        //   }
        // });
        self.addFileSelected(e);
        // self.init(file.name.slice(0, -extension.length-1));
      }
    },

    getCsvColums: function(file) {
      var promise = $.Deferred();
      var reader = new FileReader();

      reader.onload = function(ev) {
        var filePart = ev.target.result.split(0, 1)[0];
        promise.resolve(filePart.substr(0, filePart.indexOf('\n')));
      };
      reader.onerror = function(error) {
        promise.reject('There was an error reading the csv file');
      };

      reader.readAsText(file);

      return promise;
    },

    getColumns: function(name) {
      var self = this;
      var query = 'SELECT * FROM ' + name + ' LIMIT 0';
      var defer = new $.Deferred();
      var columns = [];
      $.getJSON('https://'+this.data.cartodb_user+'.cartodb.com/api/v2/sql/?q='+query)
        .done(function(data){
          $.each(data.fields, function(key) {
            if (!_.contains(self.ignored_columns, key)) {
              columns.push(key);
            }
          });
          if (columns.length){
            defer.resolve(columns);
          } else {
            defer.reject('there are not columns');
          }
        }).fail(function(){
          defer.reject('fail getting columns');
        });

      return defer;
    },

    refreshColumns: function(columns) {
      var self = this;
      var columnsContainer = this.list.getElementsByClassName('box-list')[0];
      var valueSelected = this.list.querySelectorAll('input')[0].value;
      columnsContainer.innerHTML = '';
      _.each(columns, function(element) {
        columnsContainer.insertAdjacentHTML('afterbegin', self.getColummn(element, valueSelected));
      });
      columnsContainer.classList.remove('_is-loading');
    },

    getColummn: function(element, valueSelected) {
      var column = {
        value: element,
        selectedClass: (element === valueSelected) ? '_selected':''
      };
      return this._columnTemplate()(column);
    },

    _columnTemplate: function() {
      return _.template('<div class="item <%= selectedClass %>" data-value="<%= value %>" >'+
                          '<span> <%= value %> </span> '+
                        ' </div>');
    },

    handleColumnsError: function(error) {
      console.log(error);
    },

    addFileSelected: function(e) {
      this.fileInput = e.currentTarget;
      if (this.fileInput.files[0]) {
        var tpl = this._fileTemplate()({fileName: this.fileInput.files[0].name});
        document.getElementById('filename').insertAdjacentHTML('beforeend', tpl);
      }
      this.el.getElementsByClassName('input-wrapper')[0].classList.add('_hidden');
    },

    _fileTemplate: function() {
      return _.template('<div class="row file"> <div class="name grid-xs-12"> <p> <%= fileName %> </p> <span class="close"> ×</span> </div> </div>');
    },

    removeFileSelected: function(e) {
      if (e) {
        var el = e.currentTarget.parentElement;
        el.parentNode.removeChild(el);
      }
      this.fileInput.value = '';
      this.el.getElementsByClassName('input-wrapper')[0].classList.remove('_hidden');
    },

    onAddNewItem: function(e) {
      e.currentTarget.getElementsByClassName('add_fields')[0].classList.add('_hidden');
    },

    onRemoveNewItem: function(e) {
      e.currentTarget.getElementsByClassName('add_fields')[0].classList.remove('_hidden');
    },

    onClickItem: function(e) {
      this.currentItem = e.currentTarget;
      this.selectCurrent(e);
      this.updateValue(e);

      this.category.init(e.currentTarget.getAttribute('data-value'));
    },

    selectCurrent: function(e) {
      var el = this.currentItem;
      var siblings = [].filter.call(el.parentNode.children, function(child) {
        return child.localName == 'div' && child !== el;
      });
      el.classList.add('_selected');
      siblings.forEach(function(e) {
        e.classList.remove('_selected');
      });
    },

    updateValue: function(e) {
      var target = e.currentTarget;
      document.getElementById('column-input-'+this.layerId)
        .value = e.currentTarget.getAttribute('data-value');
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
