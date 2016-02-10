'use strict';

(function(App) {

  App.View = App.View || {};

  App.View.CasesFilter = Backbone.View.extend({

    defaults: {
      filterName: 'tags[]',
      placeholder: 'Select filter',
      initialTag: false
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.initialTag = this.options.initialTag;
      this.filterName = this.options.filterName;
      this.placeholder = this.options.placeholder;
      this.casesContainer = document.getElementById('casesArticles');
      this.articleMaps = [];

      this.cases = new App.Collection.CaseStudyCollection();

      this._initSearchBox();
      this._setListeners();


      if (this.initialTag) {
        this.updateTag(this.initialTag);
      }

      this.casesContainer.classList.remove('_is-loading');

    },

    /**
     * Function to initialize the searchBox
     */
    _initSearchBox: function() {
      this.tags = this.$('#searchBox');
      this.tags.select2({
        theme: 'esa',
        placeholder: this.placeholder,
        minimumResultsForSearch: Infinity
      });
    },

    /**
     * Function to set searchBox event listeners
     */
    _setListeners: function() {
      this.tags.on('change', _.bind(this._onSelectChange, this) );
    },

    /**
     * Function to change the tag filter value
     */
    updateTag: function(value) {
      if (this.tags.val()!== value){
        this.tags.val(value).trigger('change');
      }
    },

    /**
     * Function to change the tag filter value
     */
    _onSelectChange: function() {
      this.trigger('tag:update', this.tags.val());
      this._getCases();
    },

    /**
     * Function to get the filtered by tag study cases
     */
    _getCases: function() {
      var self = this;
      var params = this.tags.val()? this.filterName+'='+this.tags.val(): '';

      this.casesContainer.classList.add('_is-loading');
      this.cases.fetch({data:params}).done(function(data){
        self._refreshCases(data.case_studies, false);
        self.renderCasesMap(data.case_studies);
      }).fail(function(error){
        self._refreshCases(error,true);
      });
    },

    /**
     * Function to paint the filtered study cases
     */
    _refreshCases: function(studyCases, error) {
      var self = this;
      if (error) {
        self.casesContainer.innerHTML = '<p class="empty"> There was an error getting the cases <p>';
      } else {
        if (studyCases.length) {
          self.casesContainer.innerHTML = '';
          _.each(studyCases,function(studyCase){
            self.casesContainer.insertAdjacentHTML("beforeend", self._caseTemplate(studyCase));
          });
        } else {
          self.casesContainer.innerHTML = '<p class="empty"> There are no results with the selected tag <p>';
        }
      }
      this.casesContainer.classList.remove('_is-loading');
    },

    /**
     * Function to get the case with template
     */
    _caseTemplate: function(studyCase) {
      return '<article id= "case-'+studyCase.id+'" class="grid-xs-12 grid-sm-6 grid-md-4 case">'+
                '<a href="'+ studyCase.case_path+'">'+
                  '<div class="article-map"></div>'+
                  '<div class="caption">'+
                    '<h2>'+studyCase.title+'</h2>'+
                  '</div>'+
                '</a>'+
              '<article>';
    },

    /**
     * Function to render the study cases maps
     */
    renderCasesMap: function(caseStudies) {
      var self = this;
      if (this.articleMaps.length) {
        _.each(this.articleMaps, function(articleMap){
          articleMap.remove();
        });
      }
      _.each(caseStudies, function(caseStudy, index){
        var el = document.getElementById('case-'+caseStudy.id).getElementsByClassName('article-map')[0];
        self.articleMaps[index] = new App.View.Map({
          el: el,
          template: 0,
          basemap: 'satellite',
          dragging: false
        });
        self.articleMaps[index].setView([caseStudy.lat,caseStudy.lng], 13);
      });
    },


  });

})(window.App || {});
