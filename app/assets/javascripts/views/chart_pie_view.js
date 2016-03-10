'use strict';

/**
 * Chart pie view
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.ChartPie = Backbone.View.extend({

    events: {
    },

    defaults: {
      chartEl: '#pie-chart',
      animationTime: 400,
      outerRadius: 40,
      removeTimeout: 300,
      margin: {
        top: 0,
        right: 40,
        bottom: 0,
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
      this.theme = this.options.theme;
      this.animate = this.options.animate;
      this.selectedYear = this.options.currentYear;
      this.chartEl = this.options.chartEl;
      this.legendEl = this.options.legendEl;
      this.margin = this.options.margin;
      this.outerRadius = this.options.outerRadius;
      this.animationTime = this.options.animationTime;
      this.removeTimeout = this.options.removeTimeout;

      this._render();
      this._setListeners();
    },

    /**
     * Set listeners
     */
    _setListeners: function() {
      $(this.legendEl).delegate('.action', 'click', this._filterByDate.bind(this));
    },

    /**
     * Unset listeners
     */
    _unsetListeners: function() {
      $(this.legendEl).undelegate('.action', 'click');
    },

    _render: function() {
      this._setUpGraph();
      this._parseData();
      this._checkParams();
      this._renderGraph();
      this._renderLegend();
    },

    _setUpGraph: function() {
      var el = this.el;
      var margin = this.margin;
      this.cWidth = el.clientWidth;
      this.cHeight = el.clientHeight;

      this.cWidth = this.cWidth - margin.left - margin.right;
      this.cHeight = this.cHeight - margin.top - margin.bottom;
      this.radius = Math.min(this.cWidth - this.outerRadius, this.cHeight - this.outerRadius) / 2;

      this.el.classList.add(this.theme.colorPalette === 2 ? '-palette2':'-palette1');

      this.svg = d3.select(el).append('svg')
        .attr('width', this.cWidth + margin.left + margin.right)
        .attr('height', this.cHeight + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    },

    _parseData: function() {
      var allData = this.data;

      if (this.selectedYear) {
        _.map(allData, function(d) {
          d.year = parseInt(d.year, 10);
        });

        this.chartData = _.where(allData, { year: this.selectedYear });
        this.years = _.uniq(_.pluck(allData, 'year'));
      } else {
        this.chartData = allData;
      }
    },

    _tweenPie: function(finish) {
      var self = this;
      var start = {
        startAngle: 0,
        endAngle: 0
      };
      var i = d3.interpolate(start, finish);

      return function(d) { return self.arc(i(d)); };
    },

    _tweenPieOut: function(b) {
      var self = this;
      var start = {
        startAngle: b.startAngle,
        endAngle: b.endAngle
      };

      b.startAngle = 0;
      b.endAngle = 0;
      b.value = 0;

      var i = d3.interpolate(start, b);
      return function(t) {
        return self.arc(i(t));
      };
    },

    _checkParams: function() {
      if (!this.animate) {
        this.animationTime = 0;
      }
    },

    _renderGraph: function() {
      var self = this;

      this.arc = d3.svg.arc()
        .outerRadius(this.radius)
        .innerRadius(0);

      var pie = d3.layout.pie()
        .value(function(d) { return d.value });

      var container = this.svg.append('g')
        .attr('class', 'container')
        .attr('transform', 'translate(' + (this.cWidth / 2) + ', ' +
          ((this.cHeight / 2)  - (this.margin.top / 2)) + ')');

      this.pie = container.selectAll('.arc')
        .data(pie(this.chartData))
        .enter().append('g')
          .attr('data-category', function(d) {
            return d.data.category;
          })
          .attr('class', 'arc');

      this.pie.append('path')
        .attr('d', this.arc)
        .style('fill', function(d) { return d.data.color })
        .style('stroke', function(d) { return d.data.color })
        .transition()
        .duration(this.animationTime)
        .attrTween('d', this._tweenPie.bind(this));
    },

    _renderLegend: function() {
      if (this.selectedYear) {
        var self = this;
        var years = this.years;
        var container = this.legendEl;

        debugger;
        container.innerHTML = '';
        container.classList.add(self.data.colorPalette === 2 ? '-palette2':'-palette1');

        years.forEach(function(year) {
          var itemEl = document.createElement('div');
          var itemText = document.createTextNode(year);
          itemEl.classList.add('action');
          itemEl.dataset.year = year;
          itemEl.appendChild(itemText);

          if (year === self.selectedYear) {
            itemEl.classList.add('selected');
          }

          container.appendChild(itemEl);
        });
      }
    },

    _resetLegend: function() {
      var container = this.legendEl;
      container.innerHTML = '';
    },

    _filterByDate: function(ev) {
      var element = ev.currentTarget;
      var selectedYear = element.dataset.year;
      var fullDate = new Date(selectedYear);
      var year = fullDate.getFullYear();

      this.trigger('timeline:change:year', year);
    },

    highlight: function(category) {
      var elems = this.el.querySelectorAll('.arc');

      for (var el in elems) {
        var current = elems[el];

        if (current && current.getAttribute) {
          var cat = current.getAttribute('data-category');
          if (category === '') {
            current.classList.remove('unHighLight');
          } else if (cat !== category) {
            current.classList.add('unHighLight');
          } else {
            current.classList.remove('unHighLight');
          }
        }
      }
    },

    prepareRemove: function() {
      this.animationTime = this.defaults.animationTime;

      this.svg.selectAll('path').transition()
        .duration(this.animationTime)
        .attrTween('d', this._tweenPieOut.bind(this));

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
        this._resetLegend();

        this._unsetListeners();
        this.undelegateEvents();
      }
    }
  });

})(window.App || {});
