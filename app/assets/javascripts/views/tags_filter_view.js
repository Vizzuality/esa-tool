'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.TagsFilter = Backbone.View.extend({

    defaults: {
      filterName: 'tags[]',
    },

    events : {
      'click .tag' : '_onClickTag'
    },

    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params.options || {});
      this.filterName = this.options.filterName;
      this.isLanding = window.location.pathname !== '/' ? false : true;
    },

    _onClickTag: function(e) {
      this.currentTag = e.currentTarget.getAttribute('data-value');
      this._setFilter(this.currentTag);
    },

    _setFilter: function(value) {
      if (this.isLanding) {
        this._setSelect2Tag(value);
      } else {
        this._redirectToLanding(value);
      }
    },

    _setSelect2Tag: function(value) {
      Backbone.trigger('menuTag:update', value);
      this.trigger('menu:close');
    },

    _redirectToLanding: function(value) {
      console.log('redirect to:'+value);
    }

  });

})(window.App || {});
