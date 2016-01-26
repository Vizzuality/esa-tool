'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.Search = Backbone.View.extend({

    defaults: {
      searchTag: 'search'
    },

    events: {
      'click .close': '_hideResults'
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.searchTag = this.options.searchTag;

      this.input = document.getElementById('caseInputSearch');
      this.resultsContainer = document.getElementById('resultsContainer');

      this.cases = new App.Collection.CaseStudyCollection();

      this._setListeners();
    },
    /**
     * Function to set searchForm event listeners
     */
    _setListeners: function() {
      var self = this;
      this.$el.submit( function(e) {
        e.preventDefault();
        self._getCases();
      });
      this.$el.on("keyup", _.debounce(_.bind(this._getCases, this), 200));
    },

    /**
     * Function to get the filtered study cases by title
     */
    _getCases: function(e) {
      var self = this;
      if (this.input.value) {
        var params = this.searchTag+'='+this.input.value;
        this.cases.fetch({data:params}).done(function(data){
          self._refreshCases(data.case_studies);
        });
      } else {
        self._hideResults();
      }
    },

    /**
     * Function to hide the cases search results
     */
    _hideResults: function() {
      this.el.classList.remove('open');
    },

    /**
     * Function to paint the study cases search results
     */
    _refreshCases: function(studyCases) {
      var self = this;
      self.resultsContainer.innerHTML = '';
      self.el.classList.add('open');
      if (studyCases.length) {
        _.each(studyCases,function(studyCase){
          self.resultsContainer.insertAdjacentHTML('beforeend', self._caseTemplate(studyCase));
        });
      } else {
        self.resultsContainer.insertAdjacentHTML('beforeend', '<span class="result"> There are no results </span>');
      }
    },

    /**
     * Function to get the result with template
     */
    _caseTemplate: function(studyCase) {
      return '<li >'+
                '<a class="result" href="'+ studyCase.case_path+'">'+
                  studyCase.title +
                '</a>'+
              '</li>';
    },

  });

})(window.App || {});
