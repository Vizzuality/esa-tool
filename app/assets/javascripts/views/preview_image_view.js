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
      var file = e.target.files[0];
      reader.onload = function() {
        var parent = e.currentTarget.parentNode;
        parent.style.backgroundImage = 'url(' + reader.result + ')';
        if (!parent.classList.contains('-previewing')) {
          parent.classList.add('-previewing');
          parent.insertAdjacentHTML('beforeend','<span class="close">×</div>');
          parent.getElementsByClassName('close')[0].addEventListener('click', self.cleanPreviewImage);
        }
      };
      if (file && file.type.match('image.*')) {
        reader.readAsDataURL(file);
      }
    },

    cleanPreviewImage: function(e) {
      var target = e.currentTarget.parentNode;
      target.style.backgroundImage = null;
      target.classList.remove('-previewing');
      target.removeChild(e.currentTarget);
      target.querySelectorAll('input[type="file"]')[0].value = "";
    }

  });

})(window.App || {});
