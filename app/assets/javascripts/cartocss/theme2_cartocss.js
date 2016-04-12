'use strict';

(function(root) {

  root.App.CartoCSS = root.App.CartoCSS || {};

  root.App.CartoCSS.Theme2 = {
    'main': '#000000',
    'palette1': [
      '#2B7312',
      '#FF6600',
      '#229A00',
      '#FFFFFF',
      '#00D0D6',
      '#779FF6',
      '#00D398',
      '#ADD4A0',
      '#ffffff'
    ],
    'palette2': [
      '#2B7312',
      '#FF6600',
      '#229A00',
      '#FFFFFF',
      '#00D0D6',
      '#779FF6',
      '#00D398',
      '#ADD4A0',
      '#ffffff'
    ],
    'default-p1': {
      'polygon-opacity': 1,
      'line-offset': 0,
      'line-width': 0,
      'line-color': 'transparent',
      'line-opacity': 0,
      'line-rasterizer': 'fast'
    },
    'default-p2': {
      'polygon-opacity': 0.3,
      'line-offset': 0,
      'line-width': 0,
      'line-color': 'transparent',
      'line-opacity': 0,
      'line-rasterizer': 'fast'
    },
    'data':{
      'polygon-fill': '%',
      'polygon-opacity': 1
    }
  };

})(window);
