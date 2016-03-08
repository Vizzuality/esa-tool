'use strict';

(function(root) {

  root.App.Helper = root.App.Helper || {};

  root.App.Helper.deserialize = function(string) {
    var obj = {},
        fields = [];
    string = string.replace(/\+/g, '%20');

    if (string){
      fields = string.split('&');

      _.each(fields, function(item){
        var nameValue = item.split('=');
        var name = decodeURIComponent(nameValue[0]);
        var value = decodeURIComponent(nameValue[1]);
        obj[name] = value;
      });
      return obj;
    } else {
      return null;
    }
  };

  root.App.Helper.hexToRgba = function(color, opacity) {
    var hex = color.replace('#','');
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);

    return 'rgba('+r+','+g+','+b+','+opacity/100+')';
  };

  root.App.Helper.switchInputColors = function(value) {
    if (! !!value) return null;

    var values = value.split('\n'),
        categColor = {};
    for (var i = 0; i < values.length; i ++) {
      if (values[i].length < 1) break;
      categColor[values[i].split('-')[1]] =  values[i].split('-')[0];
    }
    return categColor;
  }

})(window);
