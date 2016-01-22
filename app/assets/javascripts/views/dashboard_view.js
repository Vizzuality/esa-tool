'use strict';

/**
 * Dashboard view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Dashboard = Backbone.View.extend({

    events: {
      'click .charts-nav li.tab-title': '_toggleChart'
    },

    defaults: {
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      
      this._initLegend();
      this._initChart();
      // this._initTimeline();
    },

    /**
     * Updates the views with new data
     * @param {Object} raw data from the backend
     * @param {Object} layer data
     */
    update: function(data, layer) {
      var self = this;
      this.data = data;

      // TEMP: Delay loading of components
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }

      this.updateTimer = setTimeout(function() {
        self._initSelectedChart();
        self.legend.update(data, layer);
      }, 3000);
    },

    /**
     * Initializes the legend and its events
     */
    _initLegend: function() {
      var parent = this.el;
      var elem = parent.querySelector('.legend');

      this.legend = new App.View.Legend({
        el: elem
      });

      this.listenTo(this.legend, 'legend:filter', this._hightLight, this);
    },

    /**
     * Initializes the chart container 
     */
    _initChart: function() {
      var parent = this.el;
      var elem = parent.querySelector('.chart');
      elem.classList.add('_is-loading');
    },

    /**
     * This intializes the charts
     */
    _initSelectedChart: function() {
      var elem = this.el.querySelector('.chart');
      elem.classList.remove('_is-loading');   

      var charts = this.data.charts;

      if (charts.length > 0) {
        var chart = charts[0] && charts[0].name ? charts[0].name : null;

        if (chart) {
          this._renderChart(chart);
        }
      }
    },

    /**
     * This intializes the timeline
     */
    _initTimeline: function() {
      var parent = this.el;
      var elem = parent.querySelector('.charts-timeline');
      var data = this.data.groups;

      if (this.timeline) {
        this.timeline.remove();
        this.timeline = null;
      }

      this.timeline = new App.View.Timeline({
        el: elem,
        data: data
      });
    },

    /**
     *  Renders the specified chart
     * @param {String} type line | pie | bars
     */
    _renderChart: function(type) {
      switch (type) {
        case 'line':
          this._renderChartLine();
          break;
        case 'pie':
          this._renderChartPie();
          break;
        case 'bar':
          this._renderChartBar();
          break;
        default:
          break;
      }
    },

    /** 
     * Renders the area chart
     */
    _renderChartLine: function() {
      var parent = this.el;
      var chartEl = parent.querySelector('#line-chart');

      var data = this.data.groups;

      if (this.chart) {
        this.chart.remove();
        this.chart = null;
      }

      this.chart = new App.View.ChartLine({
        el: chartEl,
        data: data
      });
    },

    /** 
     * Renders the pie chart
     */
    _renderChartPie: function() {
      var parent = this.el;
      var chartEl = parent.querySelector('#pie-chart');

      var data = this.data.groups;

      if (this.chart) {
        this.chart.remove();
        this.chart = null;
      }

      this.chart = new App.View.ChartPie({
        el: chartEl,
        data: data
      });
    },

    /** 
     * Renders the bar chart
     */
    _renderChartBar: function() {
      var parent = this.el;
      var chartEl = parent.querySelector('#bar-chart');

      var data = this.data.groups;

      if (this.chart) {
        this.chart.remove();
        this.chart = null;
      }

      this.chart = new App.View.ChartBar({
        el: chartEl,
        data: data
      });
    },

    /**
     * Toggles the navigation depending on selection
     * @param {Object} click event
     */
    _toggleChart: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var self = this;
      var elem = ev.currentTarget;

      if (!elem.classList.contains('-active')) {
        var currentTab = elem.getAttribute('data-tab');
        var currentTabContent = this.el.querySelector("[data-tab-content='"+ currentTab +"']");
        var previousTabSelected = this.el.querySelector('.charts-nav .-active');
        var previousContentSelected = this.el.querySelector('.charts-content .-active');

        this._removeChart();

        if (this.tabContentTimer) {
          clearTimeout(this.tabContentTimer);
          this.tabContentTimer = null;
        }

        this.tabContentTimer = setTimeout(function() {
          previousTabSelected.classList.remove('-active');
          previousContentSelected.classList.remove('-active');

          elem.classList.add('-active');
          currentTabContent.classList.add('-active');
          self._renderChart(currentTab);
        }, 300);
      }
    },

    /**
     * Sets the default tab
     */
    _defaultTabs: function() {
      var currentTabSelected = this.el.querySelector('.charts-nav .-active');
      var curremtContentSelected = this.el.querySelector('.charts-content .-active');
      var defaultTab = this.el.querySelector('.charts-nav li');
      var defaultTabContent = this.el.querySelector('.charts-content .tab-content');

      if (currentTabSelected) {
        currentTabSelected.classList.remove('-active');
      }

      if (curremtContentSelected) {
        curremtContentSelected.classList.remove('-active');
      }

      if (defaultTab) {
        defaultTab.classList.add('-active');
      }

      if (defaultTabContent) {
        defaultTabContent.classList.add('-active');
      }
    },

    /** 
     * Filters the content by a category
     */
    _hightLight: function(category) {
      this.trigger('dashboard:filter', category);
    },

    /** 
     * Removes the chart instance
     */
    _removeChart: function() {
      if (this.chart) {
        this.chart.prepareRemove();
        this.chart = null;
      }
    },

    /** 
     * Removes the legend instance
     */
    _removeLegend: function() {
      if (this.legend) {
        this.legend.remove();
        this.legend = null;
      }
    },

    /** 
     * Removes the views and undelegates events
     */
    remove: function() {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }
      
      this._removeChart();
      this._removeLegend();
      this._defaultTabs();
      this.undelegateEvents();
      this.stopListening();
    }

  });

})(window.App || {});