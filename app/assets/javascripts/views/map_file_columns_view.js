'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.MapFileColumns = Backbone.View.extend({

    defaults: {
      ignored_columns: ['cartodb_id','the_geom','the_geom_webmercator'],
      fileInput: 'map_file',
      fileInputWrapper: 'input-file-wrapper',
      fileNameContainer: 'filename',
      columnInput: 'page_column_selected',
      columnListContainer: 'map-columns-list',
    },

    columns: [],

    events: {
      'change #map_file': 'onInputChanged',
      'click .close': 'removeFileSelected',
      'click .item': 'onClickItem',
      'click .add_fields': 'onAddItem'
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});

      this.data = this._getAppData();
      this.ignored_columns = this.options.ignored_columns;
      this.columnListContainer = document.getElementById(this.options.columnListContainer);
      this.fileInput = document.getElementById(this.options.fileInput);
      this.fileInputWrapper = document.getElementById(this.options.fileInputWrapper);
      this.columnInput = document.getElementById(this.options.columnInput);
      this.fileNameContainer = document.getElementById(this.options.fileNameContainer);

      if (this.fileNameContainer && this.fileNameContainer.getAttribute('data-filename')) {
        this.init(this.fileNameContainer.getAttribute('data-filename'));
      }
    },

    init: function(fileName) {
      var self = this
      self.columns = [];
      // self.addFileSelected();
      var promise = self.getColumns(fileName);
      promise.done(function(){
        self.refreshColumns();
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
        self.addFileSelected();
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
      $.getJSON('https://'+this.data.cartodb_user+'.cartodb.com/api/v2/sql/?q='+query)
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
      this.columnListContainer.innerHTML = '';
      _.each(self.columns, function(element){
        self.addColummn(element);
      });
    },

    addColummn: function(element) {
      var column = {
        value: element,
        selectedClass: (element === this.columnInput.value) ? '_selected':''
      };
      var tpl = this._columnTemplate()(column);
      this.columnListContainer.insertAdjacentHTML("afterbegin", tpl);
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
      if (this.fileInput.files[0]) {
        var tpl = this._fileTemplate()({fileName: this.fileInput.files[0].name});
        this.fileNameContainer.insertAdjacentHTML('beforeend', tpl);
      }
      this.fileInputWrapper.classList.add('_hidden');
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
      this.fileInput.parentElement.classList.remove('_hidden');
    },

    onAddItem: function(e) {
      e.currentTarget.classList.add('_hidden');
    },

    onClickItem: function(e) {
      this.currentItem = e.currentTarget;
      this.selectCurrent();
      this.updateValue();
    },

    selectCurrent: function() {
      var el = this.currentItem;
      var siblings = [].filter.call(el.parentNode.children, function(child) {
        return child.localName == 'div' && child !== el;
      });
      el.classList.add('_selected');
      siblings.forEach(function(e) {
        e.classList.remove('_selected');
      });
    },

    updateValue: function() {
      this.columnInput.value = this.currentItem.getAttribute('data-value');
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
