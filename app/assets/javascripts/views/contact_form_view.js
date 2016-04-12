'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.ContactForm = Backbone.View.extend({

    events:{
      'click .reset':'onFormOKClick'
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.formContainer = this.el.getElementsByClassName('form')[0];
      this.form = this.formContainer.getElementsByTagName('form')[0];
      this.feedback = this.el.getElementsByClassName('feedback')[0];
      this.feedbackContent = this.el.getElementsByClassName('feedback-content')[0];
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
      this.feedbackContent.innerHTML = '<p> Thanks '+ data.name + '</p>';
      if (wasGood) {
        this.feedbackContent.insertAdjacentHTML('beforeend', '<p> The contact form was sent succefully </p>');
      } else {
        this.feedbackContent.insertAdjacentHTML('beforeend', '<p> There was an error, please try it later </p>');
      }
      this.formContainer.classList.add('_hidden');
      this.feedback.classList.remove('_hidden');
    },

    onFormOKClick: function() {
      this.form.reset();
      this.formContainer.classList.remove('_hidden');
      this.feedback.classList.add('_hidden');
    }

  });

})(window.App || {});
