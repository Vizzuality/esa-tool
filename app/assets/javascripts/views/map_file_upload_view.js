'use strict';

(function(App) {

  App.View = App.View ||  {};

  App.View.MapFileUpload = Backbone.View.extend({

    events: {
      'change #map_file': 'onInputChanged',
      'click .close': 'removeFileSelected'
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.rastertitle = document.getElementById('page_title');
    },

    onInputChanged: function(e) {
      var self = this;
      var file = e.currentTarget.files[0];
      var extension = file.name.substr(file.name.lastIndexOf('.') + 1);
      // var columns = self.getColums(file);
      // columns.done(function(columns){
      //   if (columns.indexOf('year') === -1) {
      //     alert('The selected shapefile file doesn\'t contain the year column');
      //     self.removeFileSelected();
      //   } else {
      //     self.addFileSelected();
      //   }
      // });
      // self.init(file.name.slice(0, -extension.length-1
      self.addFileSelected(e);
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

    addFileSelected: function(e) {
      this.fileInput = e.currentTarget;
      if (this.fileInput.files[0]) {
        var tpl = this._fileTemplate()({
          fileName: this.fileInput.files[0].name
        });
        if (this.rastertitle) {
          this.rastertitle.value = (!!this.rastertitle.value) ? this.rastertitle.value : this.fileInput.files[0].name;
        }
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
    }
  });

}) (window.App ||  {});
