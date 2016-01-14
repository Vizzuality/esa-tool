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
      this.checkSelecteds();
    },

    checkSelecteds: function() {
      this.inputs = document.getElementsByClassName('association-input');
      _.each(this.inputs,function(e){
        if (e.checked) {
          document.querySelectorAll('[data-input='+e.id+']')[0].classList.add('_selected');
        }
      });
    },

    onClickItem: function(e) {
      this.currentItem = e.currentTarget;

      if (this.currentItem.getAttribute('data-multiple')!=="yes"){
        this.selectCurrent();
      } else {
        this.toggleSelection();
      }

      if (this.currentItem.getAttribute('data-input')){
        this.checkInput(this.currentItem.getAttribute('data-input'));
      } else {
        this.updateValue();
      }
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

    toggleSelection: function() {
      var el = this.currentItem;
      el.classList.toggle('_selected');
    },

    updateValue: function() {
      this.inputElement.value = this.currentItem.getAttribute('data-value');
    },

    checkInput: function(id) {
      var el = this.currentItem;
      var input = document.getElementById(id);
      if (el.classList.contains('_selected')){
        input.checked = true;
      } else {
        input.checked = false;
      }
    }

  });

})(window.App || {});
