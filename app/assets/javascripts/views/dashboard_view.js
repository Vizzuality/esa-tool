'use strict';

/**
 * Dashboard view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Dashboard = Backbone.View.extend({

    events: {
      'click .charts-nav li.tab-title': '_toggleChart',
      'click .legend-nav li.tab-title': '_toggleLayer'
    },

    defaults: {
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.layers = this.options.data.layers;
      this.charts = this.options.data.charts.length ? true:false;
      this.theme = {
        template: this.options.data.template,
        colorPalette:this.options.data.colorPalette
      };

      this._initLegend();

      if (this.charts){
        this._initChart();
        if (this.layers.length>1){
          this._initTimeline();
        }
      }
    },

    _setChartListeners: function() {
      this.listenTo(this.chart, 'timeline:change:year', this._onTimelineChanged);
      this.listenTo(this, 'chart:filter', this.chart.highlight);
    },

    start: function() {
      var data = _.flatten(_.values(this.data.dashboard));

      if (this.timeline && this.currentYear) {
        this.timeline.start({
          data: data
        });
      }
    },

    /**
     * Updates the views with new data
     * @param {Object} raw data from the backend
     * @param {Object} layer data
     */
    update: function(data, currentLayer) {
      this.data = data.data;
      this.animate = data.animate;
      this.currentData = data.currentData;
      this.currentYear = parseInt(data.currentYear, 10);
      var layer = _.findWhere(data.data.layers, { table_name: currentLayer });

      if (this.charts) {
        if (this.selectedChart !== 'line') {
          this._initSelectedChart();
        } else {
          this.chart.updateTimeline(this.currentYear);
        }
      }

      this.legend.update(data, layer);

      if (this.timeline && this.currentYear) {
        this.timeline.show();
      }
    },

    /**
     * Updates the childs views state
     * @param {Object} parameters
     */
    updateState: function(params) {
      if (this.timeline) {
        this.timeline.updateState(params);
      }
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
      var elem = parent.querySelector('.charts');
      elem.classList.add('_is-loading');
    },

    /**
     * This intializes the charts
     */
    _initSelectedChart: function() {
      var elem = this.el.querySelector('.charts');
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

      if (this.timeline) {
        this.timeline.remove();
        this.timeline = null;
      }

      this.timeline = new App.View.Timeline({
        el: elem,
        currentYear: this.currentYear
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
        theme: this.theme,
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
        theme: this.theme,
        currentYear: this.currentYear,
        animate: this.animate
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
        theme: this.theme,
        currentYear: this.currentYear,
        animate: this.animate
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
        this.animate = true;
        this.isRemoving = true;
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
     * Toggles the layer depending on selection
     * @param {Object} click event
     */
    _toggleLayer: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var self = this;
      var elem = ev.currentTarget;

      if (!elem.classList.contains('-active')) {
        var currentTab = elem.getAttribute('data-tab');
        var previousTabSelected = this.el.querySelector('.legend-nav .-active');

        previousTabSelected.classList.remove('-active');
        elem.classList.add('-active');

        this.trigger('dashboard:update:layer', currentTab);
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
     * Sets the default tab
     */
    _defaultLegendTab: function() {
      var currentLegendTabSelected = this.el.querySelector('.legend-nav .-active');
      var defaultLegendTab = this.el.querySelector('.legend-nav li');

      if (currentLegendTabSelected) {
        currentLegendTabSelected.classList.remove('-active');
      }

      if (defaultLegendTab) {
        defaultLegendTab.classList.add('-active');
      }

    },

    /**
     * Filters the content by a category
     * @param {String} category
     */
    _hightLight: function(category) {
      this.trigger('dashboard:filter', category);
      this.trigger('chart:filter', category);
    },

    /**
     * Triggered when the year have changed
     * @param {Number} year
     */
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
     * Removes the timeline instance
     */
    _removeTimeline: function() {
      if (this.timeline) {
        this.timeline.remove();
        this.timeline = null;
      }
    },

    /**
     * Removes the views and undelegates events
     */
    remove: function(params) {
      this.isRemoving = true;
      this._removeChart();
      this._removeLegend();
      this._removeTimeline();
      this._defaultTabs();

      if (!params.refresh) {
        this._defaultLegendTab();
      }

      this.undelegateEvents();
      this.stopListening();
    }

  });

})(window.App || {});
