'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.CasesFilter = Backbone.View.extend({

    defaults: {
      filterName: 'tags[]',
      placeholder: 'Select filter'
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.filterName = this.options.filterName;
      this.placeholder = this.options.placeholder;
      this.casesContainer = document.getElementById('casesArticles');

      this.cases = new App.Collection.CaseStudyCollection();

      this._initSearchBox();
      this._setListeners();

    },

    /**
     * Function to initialize the searchBox
     */
    _initSearchBox: function() {
      this.search = this.$('#searchBox');
      this.search.select2({
        theme: "esa",
        placeholder: this.placeholder,
        minimumResultsForSearch: Infinity
      });
    },

    /**
     * Function to set searchBox event listeners
     */
    _setListeners: function() {
      this.search.on("select2:close", _.debounce(_.bind(this._getCases, this), 500));
    },

    /**
     * Function to get the filtered by tag study cases
     */
    _getCases: function() {
      var self = this;
      var params = this.search.val()? this.filterName+'='+this.search.val(): '';
      this.cases.fetch({data:params}).done(function(data){
        if (!_.isEqual(self.casesOriginal , data.case_studies)) {
          self.casesOriginal = data.case_studies;
          self._refreshCases(data.case_studies);
        }
      });
    },

    /**
     * Function to paint the filtered study cases
     */
    _refreshCases: function(studyCases) {
      var self = this;
      self.casesContainer.innerHTML = '';
      _.each(studyCases,function(studyCase){
        self.casesContainer.insertAdjacentHTML("beforeend", self._caseTemplate(studyCase));
      });
    },

    /**
     * Function to get the case with template
     */
    _caseTemplate: function(studyCase) {
      return '<article class="grid-xs-12 grid-sm-6 grid-md-4 case">'+
                '<a style="background-image: url('+ studyCase.cover_path + '" href="'+ studyCase.case_path+'">'+
                  '<div class="caption">'+
                    '<h2>'+studyCase.title+'</h2>'+
                  '</div>'+
                '</a>'+
              '<article>';
    },


  });

})(window.App || {});

var myFunction = function () {
  debugger;
};
