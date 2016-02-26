'use strict';

/**
 * TagsView use tagsinput jquery plugin
 * http://xoxco.com/projects/code/tagsinput/
 * @param {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.MapFileStatus = Backbone.View.extend({

    defaults: {
      apiUrl: '/backoffice/data-layers/'
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
      this.data = this._getData();
      this.layers = this.data.page.data_layers;
      this.layersUploading = [];
      this.init();
    },

    init: function(){
      var self = this;
      _.each(this.layers, function(item) {
        if (self.isFileUploading(item.import_status)) {
          self.layersUploading.push(item);
        }
      });

      if (this.layersUploading.length){
        this.checkStatus();
      } else {
        this.el.classList.remove('_is-loading');
      }

    },

    isFileUploading: function(status) {
      return (status === 'uploading' || status === 'pending') ? true : false;
    },

    getAllStatus: function() {
      var self = this;
      var layersStatus = [];
      _.each(this.layersUploading, function(item){
        layersStatus.push(self.getStatus(item.id));
      });
      return $.when.apply($, layersStatus);
    },

    checkStatus: function(){
      var self = this;
      if (this.layersUploading.length) {
        var allLayerStatus = this.getAllStatus();

        allLayerStatus.done(function(data) {
          var statusResponse;
          if (self.layersUploading.length>1) {
            statusResponse = data;
            self.layersUploading = [];
            _.each(arguments, function(item){
              var layer = item[0].data_layer;
              if (self.isFileUploading(layer.import_status)) {
                self.layersUploading.push(layer);
              }
            });
          } else {
            self.layersUploading = [];
            if (self.isFileUploading(data.data_layer.import_status)) {
              self.layersUploading.push(data.data_layer);
            }
          }
          if (self.layersUploading.length){
            setTimeout(function() {
              console.log('recheck');
              self.checkStatus();
            }, 3000);
          } else {
            self.refreshPage();
          }
        });
      }
    },

    getStatus: function(id){
      return $.getJSON(this.options.apiUrl + id);
    },

    _getData: function() {
      var data = {};

      if (gon && gon.page) {
        data.page = JSON.parse(gon.page);
      }

      return data;
    },

    refreshPage: function(){
      location.reload();
    }

  });

})(window.App || {});
