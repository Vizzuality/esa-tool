'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.LogoCollectionView = Backbone.View.extend({

    events: { },

    initialize: function() {
      this.$('a.logos-ftlight').featherlight();
      this.setListeners();
    },

    setListeners: function() {
      var self = this;
      this.$('a.logos-ftlight').on('click', function(e) {
        e.preventDefault();
        self.trigger('logo:opened', e.currentTarget.getAttribute('data-id'));
      });

      this.$('.uploaded-images').on('click', function(e) {
        var logoImg = e.currentTarget.getElementsByTagName('img')[0];
        self.trigger('logo:selected', {
          contactId: logoImg.getAttribute('data-contact'),
          imgSrc: logoImg.src
        });
      });
    }

  });

})(window.App || {});
