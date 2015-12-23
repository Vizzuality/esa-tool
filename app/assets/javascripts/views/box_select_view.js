'use strict';

/**
 * BoxSelect View allow to use box images instead checkboxes or radio inputs
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.BoxSelect = Backbone.View.extend({

    events: {
      'click .item': 'onClickItem',
      'change .input': 'toggleCustomPalette'
    },

    initialize: function() {
      this.inputElement = this.el.querySelector('.input');
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
      this.inputElement.value = this.currentItem.getAttribute('data-value');
    }

  });

})(window.App || {});
