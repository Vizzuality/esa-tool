'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.Tabs = Backbone.View.extend({

    defaults: {
      activeIndex: 0,
      tabTitleClass: 'tab-title',
      tabContentClass: 'tab-content',
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.activeIndex = this.options.activeIndex;
      this.tabs = this.$('.'+this.options.tabTitleClass);
      this.content = this.$('.'+this.options.tabContentClass);
      this.setListeners();

      this.listenTo(this, 'tab:add', this.addTab.bind(this));
    },

    setListeners: function () {
      var self = this
      this.tabs.each(function(index, elem){
        $(elem).on('click', function(e){
          e.preventDefault();
          self.goToTab(index);
        });
      });
    },

    unSetListeners: function () {
      this.tabs.each(function(index, elem){
        $(elem).off('click');
      });
    },

    reset: function (){
      this.tabs = this.$('.'+this.options.tabTitleClass);
      this.content = this.$('.'+this.options.tabContentClass);
      this.unSetListeners();
      this.setListeners();
    },

    goToTab: function (index) {
      if (index !== this.activeIndex && index >= 0 && index <= this.tabs.length) {
        this.tabs[this.activeIndex].classList.remove('-active');
        this.tabs[index].classList.add('-active');
        this.content[this.activeIndex].classList.remove('-active');
        this.content[index].classList.add('-active');
        this.activeIndex = index;
      }
    },

    addTab: function(title, content) {
      var tab = {
        title: title,
        id: Date.now()
      };

      this.lastTab = this.tabs[this.tabs.length-1];
      this.lastContent = this.content[this.content.length-1];
      $(this._tabTitleTemplate(tab)).insertBefore(this.lastTab);
      var contentContainer = $(this._tabContentTemplate(tab)).insertBefore(this.lastContent);
      content.show().appendTo(contentContainer);
      this.reset();
      this.activeIndex += 1;
      this.goToTab(this.tabs.length-2);
    },

    _tabTitleTemplate: function(tab) {
      return '<li class="'+this.options.tabTitleClass+'" data-tab=" '+tab.id+'">'+
          '<a href="#"> ' +tab.title+ '</a>'+
        '</li>';
    },

    _tabContentTemplate: function(tab) {
      return '<div class="'+this.options.tabContentClass+'" data-tab-content="'+tab.id+'"> </div>';
    }

  });

})(window.App || {});
