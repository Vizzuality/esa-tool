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
      this.details = document.getElementsByClassName('detail-item');
      _.each(this.inputs,function(e){
        if (e.checked) {
          document.querySelectorAll('[data-input='+e.id+']')[0].classList.add('_selected');
        }
      });
    },

    onClickItem: function(e) {
      this.currentItem = e.currentTarget;

      if (this.currentItem.getAttribute('data-multiple')!=="yes") {
        this.selectCurrent();
      } else {
        this.toggleSelection();
      }

      if (this.currentItem.getAttribute('data-input')) {
        if (this.currentItem.getAttribute('data-value')) {
          this.setInputValue(this.currentItem.getAttribute('data-input'),this.currentItem.getAttribute('data-value'));
        } else {
          this.checkInput(this.currentItem.getAttribute('data-input'));
        }
      } else {
        this.updateValue();
      }

      if (this.currentItem.classList.contains('detail-title')) {
        if (this.currentItem.getAttribute('data-details')) {
          this.detailsId = this.currentItem.getAttribute('data-details');
          this.showDetail(this.detailsId);
        } else {
          this.hideDetails();
        }
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

    setInputValue: function(id, value) {
      var input = document.getElementById(id);
      input.value = value;
    },

    checkInput: function(id) {
      var el = this.currentItem;
      var input = document.getElementById(id);
      if (el.classList.contains('_selected')){
        input.checked = true;
      } else {
        input.checked = false;
      }
    },

    showDetail: function(itemId) {
      document.getElementById(itemId).classList.remove('_hidden');
    },

    hideDetails: function() {
      _.each(this.details, function(item){
        item.classList.add('_hidden');
      })
    }


  });

})(window.App || {});
