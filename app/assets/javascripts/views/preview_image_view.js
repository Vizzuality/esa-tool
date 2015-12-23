'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.PreviewImage = Backbone.View.extend({

    events: {
      'change': 'setBackgroundImage'
    },

    setBackgroundImage: function(e) {
      var reader = new FileReader();
      reader.onload = function() {
        e.currentTarget.style.backgroundImage = 'url(' + reader.result + ')';
      };
      reader.readAsDataURL(e.target.files[0]);
    }

  });

})(window.App || {});
