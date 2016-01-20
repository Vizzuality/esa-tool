'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.MapFileColumns = Backbone.View.extend({

    defaults: {
      ignored_columns: ['cartodb_id','the_geom','the_geom_webmercator'],
      fileInput: 'page_file',
      fileNameContainer: 'filename',
      columnInput: 'page_column_selected',
      columnListContainer: 'map-columns-list',
    },

    columns: [],

    events: {
      'change #page_file': 'onInputChanged',
      'click .close': 'removeFileSelected',
      'click .item': 'onClickItem'
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});

      this.data = this._getAppData();
      this.ignored_columns = this.options.ignored_columns;
      this.columnListContainer = document.getElementById(this.options.columnListContainer);
      this.fileInput = document.getElementById(this.options.fileInput);
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
        self.addFileSelected();
        // self.init(file.name.slice(0, -extension.length-1));
      }
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
      _.each(self.columns, function(element, index){
        self.addColummn(element,index);
      });
    },

    addColummn: function(element) {
      this.columnListContainer.insertAdjacentHTML("afterbegin", this._columnTemplate(element));
    },

    _columnTemplate: function(element) {
      var selected_class = (element === this.columnInput.value) ? '_selected':'';
      return '<div class="item '+ selected_class +'" data-value="'+element+'">'+
              '<span>'+element+'</span>'+
            '</div>'
    },

    handleColumnsError: function(error) {
      console.log(error);
    },

    addFileSelected: function(e) {
      if (this.fileInput.files[0]) {
        this.fileNameContainer.insertAdjacentHTML('beforeend', '<p class="name">'+this.fileInput.files[0].name+'<p>');
        this.fileNameContainer.classList.remove('_hidden');
      }
    },

    removeFileSelected: function(e) {
      this.fileNameContainer.classList.add('_hidden');
      // this.columnListContainer.innerHTML = '';
      // this.columnInput.value = '';
      this.fileInput.value = '';
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
