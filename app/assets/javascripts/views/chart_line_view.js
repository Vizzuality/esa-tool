'use strict';

/**
 * Chart line view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.ChartLine = Backbone.View.extend({

    events: {
    },

    defaults: {
      chartEl: '#line-chart',
      dateFormat: '%Y',
      interpolate: 'linear',
      areaInterpolate: 'basic',
      paddingAxisLabels: 0,
      removeTransition: 500,
      removeTimeout: 300,
      handleWidth: 50,
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
      this.removeTransition = this.options.removeTransition;
      this.removeTimeout = this.options.removeTimeout;
      this.handleWidth = this.options.handleWidth;
      this.currentStep = this.options.currentStep;

      this._render();
    },

    _render: function() {
      this._setUpGraph();
      this._parseData();
      this._setAxisScale();
      this._drawStack();
      this._drawGraph();
      this._drawAxis();
      this._drawSlider();
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

      this.min = d3.min(fakeData, function(d) {
        return d.x;
      });

      this.max = d3.max(fakeData, function(d) {
        return d.x;
      });

      this.chartData = d3.nest()
        .key(function(d) { return d.category; })
        .entries(fakeData);

      var fakeColors = {
        '1971': '#2B7312',
        '1981': '#FF6600',
        '1991': '#229A00',
        '2001': '#7801FF',
        '2006': '#EA01FF'
      };

      d3.map(this.chartData, function(d) {
        var dataColor = fakeColors[d.key]

        if (dataColor) {
          d.color = dataColor;
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
          .transition()
          .duration(700) 
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

      this.svg.selectAll('.line').transition()
        .attr('stroke-dasharray', function() { 
          var total = this.getTotalLength(); 
          return total + ' ' + total;
        })
        .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
        .transition()
          .duration(300)
          .ease('linear')
          .attr('stroke-dashoffset', 0);

      this.svg.append('g')
        .attr('class', 'line-top-group')
        .attr('transform', 'translate(0,0)')
        .append('line')
          .attr('class', 'line-top')
          .attr('x1', 0)
          .attr('x2', this.cWidth)
          .attr('y1', 0)
          .attr('y1', 0);
    },

    _drawSlider: function() {
      var self = this;

      this.brush = d3.svg.brush()
        .x(this.x)
        .extent([0, 0])
        .on('brush', function() {
          if (d3.event.sourceEvent) {
            d3.event.sourceEvent.stopPropagation();
          }

          var value = self.brush.extent()[0];

          if (d3.event.sourceEvent) {
            value = self.x.invert(d3.mouse(this)[0]);
            self.brush.extent([value, value]);
          }

          self.currentStep = value;
          self._setHandlePosition();
        })
        .on('brushend', function() {
          if (!d3.event.sourceEvent) return;
          var extent0 = self.brush.extent(),
              extent1 = extent0.map(d3.time.year.round);

          if (extent1[0] >= extent1[1]) {
            extent1[0] = d3.time.year.floor(extent0[0]);
            extent1[1] = d3.time.year.ceil(extent0[1]);
          }

          if (extent1[0] < self.min) {
            extent1[0] = self.min;
          }

          if (extent1[0] > self.max) {
            extent1[0] = self.max;
          }

          self.currentStep = extent1[0];

          d3.select(this).transition()
            .duration(0) 
            .call(self.brush.extent(extent1))
            .call(self.brush.event);
        });

      this.slider = this.svg.append('g')
        .attr('class', 'handles')
        .call(this.brush);

      this.slider.selectAll('.extent,.resize')
        .remove();

      this.slider.select('.background')
        .attr('height', this.cHeight + this.margin.bottom);

      this.handle = this.slider.append('rect')
        .attr('class', 'handle')
        .attr('width', this.handleWidth)
        .attr('height', this.cHeight + this.margin.bottom + (this.margin.top / 2));

      this._setHandlePosition();
    },

    _setHandlePosition: function() {
      var self = this;

      if (!this.currentStep) {
        this.currentStep = this.max;
      }

      this.handle.attr('transform', function() {
        return 'translate('+ (self.x(self.currentStep) - 
          (self.handleWidth / 2)) + ', ' + -(self.margin.top / 2) + ')';
      });
    },
    
    prepareRemove: function() {
      this.svg.selectAll('.area')
        .transition()
        .duration((this.removeTransition * 2))
        .style('fill-opacity', function(d) { return 0 });

      this.svg.selectAll('.line')
        .transition()
        .duration(this.removeTransition)
        .ease('linear')
        .attr('stroke-dashoffset', function() { return this.getTotalLength(); });

      if (this.removeTimer) {
        clearTimeout(this.removeTimer);
        this.removeTimer = null;
      }

      this.removeTimer = setTimeout(this.remove.bind(this), this.removeTimeout);
    },

    remove: function() {
      if(this.svg) {
        var svgContainer = this.el.querySelector('svg');

        this.svg.remove();
        this.svg = null;
        this.el.removeChild(svgContainer);
      }
    }
  });

})(window.App || {});