'use strict';

/**
 * Legend view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Legend = Backbone.View.extend({

    defaults: {

    },

    events: {
      'mouseleave .legend-content': '_clearFilter'
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});

      this._render();
      this._setListeners();
    },

    /**
     * Set listeners
     */
    _setListeners: function() {
      this.$el.delegate('.item', 'mouseenter', this._activateInteraction.bind(this));
    },

    /**
     * Unset listeners
     */
    _unsetListeners: function() {
      this.$el.undelegate('.item', 'mouseenter');
    },

    /**
     * Updates the data for the list
     * @param {Object} data for the view
     * @param {Object} layer data
     */
    update: function(data, layer) {
      this.data = data.data;
      this.currentData = data.currentData;
      this.unit = data.unit;
      this.layer = layer;

      this._updateList();
    },

    /**
     * Renders the view container
     */
    _render: function() {
      var container = this.el.querySelector('.list');
      container.classList.add('_is-loading');
    },

    /**
     * Updates the list with the stored data
     */
    _updateList: function() {
      var categories = this.currentData;

      if (categories) {
        this._renderList(categories);
      }
    },

    /**
     * Renders the list
     * @param {Object} categories raw data
     * @param {Object} groupped categories with their data
     */
    _renderList: function(categories) {
      var self = this;
      var container = this.el.querySelector('.list');
      var lastCatVal = 0;
      container.innerHTML = '';
      container.classList.add(self.data.colorPalette === 2 ? '-palette2':'-palette1');

      categories.forEach(function(cat) {
        var itemContainer = document.createElement('li');
        itemContainer.dataset.category = cat.category;
        itemContainer.classList.add('item');

        var iconBgEl = document.createElement('span');
        iconBgEl.style.background = cat.color;
        iconBgEl.classList.add('icon-bg');

        var iconEl = document.createElement('span');
        iconEl.style.borderColor = cat.color.indexOf('#') ? App.Helper.rgbaToHex(cat.color) : cat.color;
        iconEl.classList.add('icon-legend');
        iconEl.appendChild(iconBgEl);


        var itemEl = document.createElement('span');
        var itemText = cat.label ? cat.label : cat.category;
        itemText = document.createTextNode(itemText);
        itemEl.appendChild(itemText);
        itemEl.classList.add('description');

        itemContainer.appendChild(iconEl);
        itemContainer.appendChild(itemEl);

        if (self.layer && !self.layer.isRaster){
          var itemValueEl = document.createElement('span');
          var itemValueText = document.createTextNode(cat.value + self.unit);
          itemValueEl.appendChild(itemValueText);
          itemValueEl.classList.add('value');
          itemContainer.appendChild(itemValueEl);
        }

        container.appendChild(itemContainer);
      });

      container.classList.remove('_is-loading');
    },

    /**
     * Filters the data by a category
     * @param {Object} event
     */
    _filter: _.debounce(function(ev) {
      var current = ev.currentTarget;
      var category = current.dataset.category;

      if (this.interactionEnabled) {
        this.trigger('legend:filter', category);
      }
    }, 100),

    /**
     * Clears the filtered content
     */
    _clearFilter: function() {
      this.interactionEnabled = false;
      this.trigger('legend:filter', '');
    },

    /**
     * Activates the interaction on hover
     */
    _activateInteraction: function(ev) {
      this.interactionEnabled = true;
      this._filter(ev);
    },

    /**
     * Removes the view content and unsets the listeners
     */
    remove: function() {
      var container = this.el.querySelector('.list');
      container.innerHTML = '';

      this._unsetListeners();
      this.undelegateEvents();
    }

  });

})(window.App || {});
