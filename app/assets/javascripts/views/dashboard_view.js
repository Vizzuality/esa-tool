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
    },

    _setChartListeners: function() {
      this.listenTo(this.chart, 'timeline:change:year', this._onTimelineChanged);
      this.listenTo(this, 'chart:filter', this.chart.highlight);
    },

    start: function() {
      this._initTimeline();
    },

    /**
     * Updates the views with new data
     * @param {Object} raw data from the backend
     * @param {Object} layer data
     */
    update: function(data, layer) {
      this.data = data.data;
      this.animate = data.animate;
      this.currentData = data.currentData;
      this.currentYear = data.currentYear;

      if (this.selectedChart !== 'line') {
        this._initSelectedChart();          
      }

      this.legend.update(data, layer);
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
      var chart;

      if (charts.length > 0) {
        if (this.selectedChart) {
          chart = _.findWhere(charts, { name: this.selectedChart });
        } else {
          chart = charts[0];
          this.selectedChart = chart.name;
        }

        if (chart.name) {
          this._renderChart(chart.name);
          this.listenTo(this.chart, 'timeline:change:year', this._onTimelineChanged);
        }
      }
    },

    /**
     * This intializes the timeline
     */
    _initTimeline: function() {
      var parent = this.el;
      var elem = parent.querySelector('.charts-timeline');
      var data = _.flatten(_.values(this.data.dashboard));

      if (this.timeline) {
        this.timeline.remove();
        this.timeline = null;
      }

      this.timeline = new App.View.Timeline({
        el: elem,
        currentYear: this.currentYear,
        data: data
      });

      this.listenTo(this.timeline, 'timeline:change:year', this._onTimelineChanged);
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
      var data = _.flatten(_.values(this.data.dashboard));

      this._removeChart();

      this.chart = new App.View.ChartLine({
        el: chartEl,
        data: data,
        currentYear: this.currentYear,
        animate: this.animate
      });

      this._setChartListeners();
    },

    /** 
     * Renders the pie chart
     */
    _renderChartPie: function() {
      var parent = this.el;
      var chartEl = parent.querySelector('#pie-chart');
      var legendEl = parent.querySelector('.pie-legend');
      var data = _.flatten(_.values(this.data.dashboard));

      this._removeChart();

      this.chart = new App.View.ChartPie({
        el: chartEl,
        legendEl: legendEl,
        data: data,
        currentYear: this.currentYear
      });

      this._setChartListeners();
    },

    /** 
     * Renders the bar chart
     */
    _renderChartBar: function() {
      var parent = this.el;
      var chartEl = parent.querySelector('#bar-chart');
      var legendEl = parent.querySelector('.bar-legend');
      var data = _.flatten(_.values(this.data.dashboard));

      this._removeChart();

      this.chart = new App.View.ChartBar({
        el: chartEl,
        legendEl: legendEl,
        data: data,
        currentYear: this.currentYear
      });

      this._setChartListeners();
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

        this.selectedChart = currentTab;
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
      this.trigger('chart:filter', category);
    },

    _onTimelineChanged: function(year) {
      this.trigger('dashboard:update:year', year);
    },

    /** 
     * Removes the chart instance
     */
    _removeChart: function() {
      if (this.chart) {
        this.chart.stopListening();

        if (this.isRemoving) {
          this.isRemoving = false;
          this.chart.prepareRemove();
        } else {
          this.chart.remove();
        }

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
      this.isRemoving = true;
      this._removeChart();
      this._removeLegend();
      this._defaultTabs();
      this.undelegateEvents();
      this.stopListening();
    }

  });

})(window.App || {});