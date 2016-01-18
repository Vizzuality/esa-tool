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
      this.data = this.options.data;

      this._initChart();
    },

    /**
     * This intializes the charts
     */
    _initChart: function() {
      var charts = this.data.charts;

      if (charts.length > 0) {
        var chart = charts[0] && charts[0].name ? charts[0].name : null;

        if (chart) {
          this._renderChart(chart);
        }
      }
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

        this.remove();

        setTimeout(function() {
          previousTabSelected.classList.remove('-active');
          previousContentSelected.classList.remove('-active');

          elem.classList.add('-active');
          currentTabContent.classList.add('-active');
          self._renderChart(currentTab);
        }, 300);
      }
    },

    remove: function() {
      if(this.chart) {
        this.chart.prepareRemove();
        this.chart = null;
      }
    }

  });

})(window.App || {});