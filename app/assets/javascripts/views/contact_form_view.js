'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.ContactForm = Backbone.View.extend({

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.form = this.el.getElementsByClassName('form')[0];
      this.feedback = this.el.getElementsByClassName('feedback')[0];
      this._setListeners();
    },

    _handleSuccessResponse: function(event, data) {
      this._setFeedback(true, data);
    },

    _handleFailResponse: function(event, data) {
      this._setFeedback(false, data);
    },

    _setListeners: function() {
      this.$el.on('ajax:success', this._handleSuccessResponse.bind(this));
      this.$el.on('ajax:fail', this._handleFailResponse.bind(this));
    },

    _setFeedback: function(wasGood, data) {
      this.feedback.innerHTML = '<p> Thanks '+ data.name + '</p>';
      if (wasGood) {
        this.feedback.insertAdjacentHTML('beforeend', '<p> The contact form was sent succefully </p>');
      } else {
        this.feedback.insertAdjacentHTML('beforeend', '<p> There was an error, please try it later </p>');
      }
      this.form.classList.add('_hidden');
      this.feedback.classList.remove('_hidden');
    }

  });

})(window.App || {});
