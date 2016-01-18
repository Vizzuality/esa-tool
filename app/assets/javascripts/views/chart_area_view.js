'use strict';

/**
 * Chart line view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.ChartArea = Backbone.View.extend({

    events: {
    },

    defaults: {
      chartEl: '#area-chart',
      dateFormat: '%Y',
      interpolate: 'linear',
      areaInterpolate: 'basic',
      paddingAxisLabels: 0,
      margin: {
        top: 30,
        right: 40,
        bottom: 40,
        left: 40
      }
    },

    /**
     * This function will be executed when the instance is created
     * @param  {Object} params
     */
    initialize: function(params) {
      this.options = _.extend({}, this.defaults, params || {});
      this.data = this.options.data;
      this.chartEl = this.options.chartEl;
      this.margin = this.options.margin;
      this.dateFormat = this.options.dateFormat;
      this.interpolate = this.options.interpolate;
      this.areaInterpolate = this.options.areaInterpolate;
      this.paddingAxisLabels = this.options.paddingAxisLabels;

      this._render();
    },

    _render: function() {
      this._setUpGraph();
      this._parseData();
      this._setAxisScale();
      this._drawStack();
      this._drawGraph();
      this._drawAxis();
    },

    _setUpGraph: function() {
      var el = this.el;
      var margin = this.margin;
      this.cWidth = el.clientWidth;
      this.cHeight = el.clientHeight;
      this.parseDate = d3.time.format(this.dateFormat).parse;

      this.cWidth = this.cWidth - margin.left - margin.right;
      this.cHeight = this.cHeight - margin.top - margin.bottom;

      this.svg = d3.select(el).append('svg')
        .attr('width', this.cWidth + margin.left + margin.right)
        .attr('height', this.cHeight + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    },

    _parseData: function() {
      var self = this;
      var data = this.data;
      this.chartData = [];

      var fakeData = [
        {
          category: '1971',
          x: '2001',
          y: 0
        },
        {
          category: '1971',
          x: '2005',
          y: 40
        },
        {
          category: '1971',
          x: '2008',
          y: 10
        },
        {
          category: '1971',
          x: '2010',
          y: 30
        },
        {
          category: '1981',
          x: '2001',
          y: 30
        },
        {
          category: '1981',
          x: '2005',
          y: 60
        },
        {
          category: '1981',
          x: '2008',
          y: 10
        },
        {
          category: '1981',
          x: '2010',
          y: 30
        },
        {
          category: '1991',
          x: '2001',
          y: 5
        },
        {
          category: '1991',
          x: '2005',
          y: 20
        },
        {
          category: '1991',
          x: '2008',
          y: 40
        },
        {
          category: '1991',
          x: '2010',
          y: 10
        },
        {
          category: '2001',
          x: '2001',
          y: 25
        },
        {
          category: '2001',
          x: '2005',
          y: 0
        },
        {
          category: '2001',
          x: '2008',
          y: 45
        },
        {
          category: '2001',
          x: '2010',
          y: 90
        },
        {
          category: '2006',
          x: '2001',
          y: 55
        },
        {
          category: '2006',
          x: '2005',
          y: 40
        },
        {
          category: '2006',
          x: '2008',
          y: 65
        },
        {
          category: '2006',
          x: '2010',
          y: 10
        }
      ];

      fakeData.forEach(function(d) {
        d.x = self.parseDate(d.x);
      });

      this.chartData = d3.nest()
        .key(function(d) { return d.category; })
        .entries(fakeData);

      d3.map(this.chartData, function(d) {
        var data = self.data[d.key][0];

        if (data) {
          d.color = data.color;
        }
      });
    },

    _setAxisScale: function() {
      this.x = d3.time.scale()
        .range([0, this.cWidth]).nice();

      this.y = d3.scale.linear()
        .range([this.cHeight, 0]);

      this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient('bottom')
        .innerTickSize(-this.cHeight)
        .ticks(d3.time.years, 3)
        .outerTickSize(0)
        .tickFormat(d3.time.format(this.dateFormat));
    },

    _setDomain: function() {
      var xValues = [];
      var yValues = [];

      this.chartData.forEach(function(d) {
        d.values.forEach(function(val) {
          xValues.push(val.x);
          yValues.push(val.y0 + val.y);
        });
      });

      this.x.domain(d3.extent(xValues, function(d) { return d; }));
      this.y.domain([0, d3.max(yValues, function(d) { return d; })]);
    },

    _drawAxis: function() {
      var self = this;

      this.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (this.cHeight) + ')')
        .call(this.xAxis)
        .selectAll('text')
          .attr('y', (self.margin.bottom / 2))
          .attr('x', self.paddingAxisLabels)
          .style('text-anchor', 'middle');

      this.svg.append('g')
        .attr('class', 'custom-domain-group')
        .attr('transform', 'translate(0, ' + this.cHeight +')')
        .append('line')
          .attr('class', 'curstom-domain')
          .attr('x1', -this.margin.left / 2)
          .attr('x2', (this.cWidth  + (this.margin.left / 2)))
          .attr('y1', 0)
          .attr('y1', 0);
    },

    _drawStack: function() {
      var self = this;

      var stack = d3.layout.stack()
        .values(function(d) { return d.values; });

      var area = d3.svg.area()
        .interpolate(this.areaInterpolate)
        .x(function(d) { return self.x(d.x); })
        .y0(function(d) { return self.y(d.y0); })
        .y1(function(d) { return self.y(d.y0 + d.y); });

      var areas = stack(this.chartData);

      this._setDomain();

      var areaGroup = this.svg.append('g')
        .attr('class', 'area-group');

      areaGroup.selectAll('.area')
        .data(areas)
        .enter().append('path')
          .attr('class', 'area')
          .attr('d', function(d) { return area(d.values); })
          .style('fill', function(d) { return d.color; });
    },

    _drawGraph: function() {
      var self = this;

      var line = d3.svg.line()
        .x(function(d) { return self.x(d.x); })
        .y(function(d) { return self.y(d.y0 + d.y); })
        .interpolate(this.interpolate);

      var lineGroup = this.svg.append('g')
        .attr('class', 'line-group');

      this.chartData.forEach(function(d, i) {
        lineGroup.append('path')
          .attr('d', line(d.values))
          .attr('class', 'line')
          .style('stroke', d.color);
      });

      this.svg.append('g')
        .attr('class', 'line-top-group')
        .attr('transform', 'translate(0,0)')
        .append('line')
          .attr('class', 'line-top')
          .attr('x1', 0)
          .attr('x2', this.cWidth)
          .attr('y1', 0)
          .attr('y1', 0);
    }
  });

})(window.App || {});