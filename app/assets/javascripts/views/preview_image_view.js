'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.PreviewImage = Backbone.View.extend({

    events: {
      'change input[type="file"]': 'setBackgroundImage',
      'click .close': 'cleanImage'
    },

    setBackgroundImage: function(e) {
      var self = this;
      var reader = new FileReader();
      var file = e.target.files[0];
      reader.onload = function() {
        var parent = e.currentTarget.parentNode;
        parent.parentNode.classList.add('_has_file');
        parent.style.backgroundImage = 'url(' + reader.result + ')';
      };
      if (file && file.type.match('image.*')) {
        reader.readAsDataURL(file);
      }
    },

    cleanImage: function(e) {
      var self = this;
      self.cleanPreviewImage(e);
      self.emptyInput(e);
    },

    cleanPreviewImage: function(e) {
      var target = e.currentTarget.parentNode.querySelectorAll('.file')[0];
      target.style.backgroundImage = null;
    },

    emptyInput: function(e) {
      var target = e.currentTarget.parentNode;
      target.classList.remove('_has_file');
      target.querySelectorAll('input[type="file"]')[0].value = "";
    }

  });

})(window.App || {});
