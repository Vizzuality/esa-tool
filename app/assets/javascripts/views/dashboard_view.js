'use strict';

/**
 * Dashboard view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.Dashboard = Backbone.View.extend({

    events: {
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

      this._initCharts();
    },

    /**
     * This intializes the charts
     */
    _initCharts: function() {
      var charts = this.data.charts;

      for (var index in charts) {
        var chart = charts[index];

        if (chart) {
          this._renderChart(chart.name);
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
          this._renderChartArea();
          break;
        default:
          break;
      }
    },

    /** 
     * Renders the area chart
     */
    _renderChartArea: function() {
      var parent = this.el;
      var chartEl = parent.querySelector('#area-chart');

      var data = this.data.groups;

      if (this.chart) {
        this.chart.remove();
        this.chart = null;
      }

      this.chart = new App.View.ChartArea({
        el: chartEl,
        data: data
      });
    }

  });

})(window.App || {});