'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.TagsFilter = Backbone.View.extend({

    defaults: {
      filter: 'tags[]',
      initialTag: false
    },

    events : {
      'click .tag' : '_onClickTag'
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.filter = this.options.filter;
      this.initialTag = this.options.initialTag;
      this.isLanding = window.location.pathname !== '/' ? false : true;
      if (this.initialTag) {
        this.checkSelected(this.initialTag);
      }
    },

    _onClickTag: function(e) {
      if (!this.currentTag || (this.currentTag.getAttribute('data-value') !== e.currentTarget.getAttribute('data-value') )){
        this.currentTag = e.currentTarget;
        this._setFilter(this.currentTag.getAttribute('data-value'));
        this.selectCurrent();
      }
    },

    selectCurrent: function() {
      var el = this.currentTag;
      var siblings = [].filter.call(el.parentNode.children, function(child) {
        return child.localName == 'span' && child !== el;
      });
      el.classList.add('_selected');
      siblings.forEach(function(e) {
        e.classList.remove('_selected');
      });
    },

    checkSelected: function(tag) {
      var self = this;
      this.inputs = this.el.getElementsByClassName('tag');
      _.each(this.inputs,function(item){
        if (item.getAttribute('data-value')===tag) {
          item.classList.add('_selected');
          self.currentTag = item;
        } else {
          item.classList.remove('_selected');
        }
      });
    },

    _setFilter: function(value) {
      if (this.isLanding) {
        this._setSelectedTag(value);
      } else {
        this._redirectToLanding(value);
      }
    },

    _setSelectedTag: function(value) {
      this.trigger('tag:update', value);
      this.trigger('menu:close');
    },

    _redirectToLanding: function(value) {
      document.location.href= '/?' + this.filter + '=' + value;
    }

  });

})(window.App || {});
