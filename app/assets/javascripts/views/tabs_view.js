'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.Tabs = Backbone.View.extend({

    defaults: {
      activeIndex: 0,
      tabTitleClass: '.tab-title',
      tabContentClass: '.tab-content'
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.activeIndex = this.options.activeIndex;
      this.tabs = this.$(this.options.tabTitleClass);
      this.content = this.$(this.options.tabContentClass);
      this.setListeners();
    },

    setListeners: function () {
      var self = this;
      this.tabs.each(function(index, elem){
        elem.addEventListener('click', function(e) {
          e.preventDefault();
          self.goToTab(index);
        });
      });
    },

    goToTab: function (index) {
      if (index !== this.activeIndex && index >= 0 && index <= this.tabs.length) {
        this.tabs[this.activeIndex].classList.remove('-active');
        this.tabs[index].classList.add('-active');
        this.content[this.activeIndex].classList.remove('-active');
        this.content[index].classList.add('-active');
        this.activeIndex = index;
      }
    }

  });

})(window.App || {});
