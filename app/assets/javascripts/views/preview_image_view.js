'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.PreviewImage = Backbone.View.extend({

    events: {
      'change': 'setBackgroundImage'
    },

    setBackgroundImage: function(e) {
      var self = this;
      var reader = new FileReader();
      reader.onload = function() {
        var parent = e.currentTarget.parentNode;
        parent.classList.add('-previewing');
        parent.style.backgroundImage = 'url(' + reader.result + ')';
        parent.insertAdjacentHTML('beforeend','<span class="close">×</div>');
        parent.getElementsByClassName('close')[0].addEventListener('click', self.cleanPreviewImage);
      };
      reader.readAsDataURL(e.target.files[0]);
    },

    cleanPreviewImage: function(e) {
      var target = e.currentTarget.parentNode;
      target.style.backgroundImage = null;
      target.classList.remove('-previewing');
      target.removeChild(e.currentTarget);
    }

  });

})(window.App || {});
