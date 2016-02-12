'use strict';

/**
 * Cases list view for add interactions to the items
 * @param  {Object} App Global object
 */
(function(App) {

  App.View = App.View || {};

  App.View.CasesList = Backbone.View.extend({

    defaults: {
    },

    initialize: function(options) {
      this.options = _.extend({}, this.defaults, options || {});
      this.data = this.options.data;
      this.casesMaps = [];
    },

    /**
     * Function to parse the layer data and initialize the 
     * dynamic generated image
     * @param {Object} list of study cases
     */
    staticMapsView: function(studyCases) {
      var self = this;
      var caseStudies = this.data.caseStudies;

      if (this.casesMaps && this.casesMaps.length > 0) {
        this.removeViews();
      } 

      _.each(studyCases,function(studyCase, index){
        var caseData = _.findWhere(caseStudies, {id: studyCase.id});
        var pages = caseData.pages;
        var dataLayers = _.flatten(_.pluck(pages, 'data_layers'));
        var el = document.getElementById('case-'+studyCase.id);

        if (dataLayers && dataLayers.length > 0) {
          var layer = dataLayers[dataLayers.length -1];

          if (layer) {  
            self.casesMaps[index] = new App.View.StaticMapView({
              el: el,
              data: self.data,
              layer: layer
            }); 
          }
        } else {
          el.classList.remove('_is-loading');
        }
      });
    },

    /**
     * Removes the initialized views
     */
    removeViews: function() {
      _.each(this.casesMaps, function(caseM) {
        if (caseM) {
          caseM.remove();
        }
      });

      this.casesMaps = [];
    }

  });

})(window.App || {});
