'use strict';

(function(root) {

  root.App.CartoCSS = root.App.CartoCSS || {};
  root.App.CartoCSS.Raster = {

    'continous': {
      'raster-scaling':'near',
      'raster-colorizer-default-mode':'linear',
      'raster-colorizer-default-color':' transparent',
      'raster-colorizer-epsilon':'0.1',
      'raster-colorizer-stops':''
    },

    'category': {
      'raster-scaling':'near',
      'raster-colorizer-default-mode':'exact',
      'raster-colorizer-default-color':' transparent',
      'raster-colorizer-epsilon':'0.1',
      'raster-colorizer-stops':''
    }

  };

})(window);
