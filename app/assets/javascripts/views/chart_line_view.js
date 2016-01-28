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
      areaAnimation: 700,
      lineAnimation: 300,
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
      this.selectedYear = this.options.currentYear;
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
      this.areaAnimation = this.options.areaAnimation;
      this.lineAnimation = this.options.lineAnimation;

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
      this.chartData = this.data;

      _.map(this.chartData, function(d) {
        d.x = d.year;
        d.y = d.value;
      });

      this.chartData.forEach(function(d) {
        d.x = self.parseDate(d.x);
      });

      this.min = d3.min(this.chartData, function(d) {
        return d.x;
      });

      this.max = d3.max(this.chartData, function(d) {
        return d.x;
      });

      this.yearsSteps = _.uniq(_.pluck(this.chartData, 'year')); 

      this.years = _.uniq(_.pluck(this.chartData, 'x'), function(y) {
        var date = new Date(y);
        return date.valueOf();
      }); 

      this.chartData = d3.nest()
        .key(function(d) { return d.category; })
        .entries(this.chartData);

      d3.map(this.chartData, function(d) {
        var dataColor = _.findWhere(self.data, { category: d.key });

        if (dataColor) {
          d.color = dataColor.color;
        }
      });
    },

    _setAxisScale: function() {
      this.x = d3.time.scale()
        .range([0, this.cWidth]);

      this.y = d3.scale.linear()
        .range([this.cHeight, 0]);

      this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient('bottom')
        .innerTickSize(-this.cHeight)
        .tickValues(this.years)
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
          .attr('data-category', function(d) {
            return d.key;
          })
          .transition()
          .duration(self.areaAnimation) 
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
          .attr('data-category', function() {
            return d.key;
          })
          .style('stroke', d.color);
      });

      this.svg.selectAll('.line').transition()
        .attr('stroke-dasharray', function() { 
          var total = this.getTotalLength(); 
          return total + ' ' + total;
        })
        .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
        .transition()
          .duration(self.lineAnimation)
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

          if(self.yearsSteps.indexOf(extent1[0].getFullYear().toString()) === -1) {
            extent1[0] = self.currentYear;
          } else {
            self.currentYear = extent1[0];
          }

          self.currentStep = extent1[0];
          self._filterByDate();

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
        var year = this.parseDate(this.selectedYear);

        this.currentStep = year;
        this.currentYear = year;
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

    _filterByDate: function() {
      var fullDate = new Date(this.currentStep);
      var year = fullDate.getFullYear();

      this.trigger('timeline:change:year', year);
    },

    highlight: function(category) {
      var elems = this.el.querySelectorAll('.area');
      var elemsLine = this.el.querySelectorAll('.line');

      for (var el in elems) {
        var current = elems[el];
        var currentLine = elemsLine[el];

        if (current && current.getAttribute) {
          var cat = current.getAttribute('data-category');
          if (category === '') {
            current.classList.remove('unHighLight');
            currentLine.classList.remove('unHighLight');
          } else if (cat !== category) {
            current.classList.add('unHighLight');
            currentLine.classList.add('unHighLight');
          } else {
            current.classList.remove('unHighLight');
            currentLine.classList.remove('unHighLight');
          }
        }
      }
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