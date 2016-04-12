'use strict';

(function(root) {

  root.App.CartoCSS = root.App.CartoCSS || {};
  root.App.CartoCSS.Theme1 = {
    'main': '#FFFFFF',
    'palette1': [
      '#2B7312',
      '#FF6600',
      '#229A00',
      '#7801FF',
      '#EA01FF',
      '#FF0060',
      '#FF6602',
      '#ffc600',
      '#ffffff'
    ],
    'palette2': [
      '#2B7312',
      '#FF6600',
      '#229A00',
      '#7801FF',
      '#EA01FF',
      '#FF0060',
      '#FF6602',
      '#ffc600',
      '#ffffff'
    ],
    'default-p1': {
      'polygon-opacity': 0.2,
      'line-offset': 0,
      'line-width': 0,
      'line-color': 'transparent',
      'line-opacity': 1,
      'line-rasterizer': 'fast'
    },
    'default-p2': {
      'polygon-opacity': 1,
      'line-offset': 0,
      'line-width': 0,
      'line-color': 'transparent',
      'line-opacity': 1,
      'line-rasterizer': 'fast'
    },
    'data':{
      'polygon-fill': '%',
      'polygon-opacity': 1,
      'line-color': '%',
      'line-width': 1
    }
  };

})(window);
