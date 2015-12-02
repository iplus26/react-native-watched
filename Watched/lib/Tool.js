'use strict';

var React = require('react-native');
var {LinkingIOS,
  Touchablehighlight,
  Text, } = React;

var SafariView = require('react-native-safari-view');

var Tool = {

  param: function(obj) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  },

  extend: function() {
    var copy, prop, i = 0,
        target = {},      // 目标对象
        length = arguments.length; 

    for ( ; i < length; i++) {
      copy = arguments[i];
      for (prop in copy) {
        if (copy.hasOwnProperty(prop)) {
          if (target.hasOwnProperty(prop)) {
            throw 'Conflict! ';
          } else {
            target[prop] = copy[prop];
          }
        }
      }
    }

    return target;
    
  },

  openURL: function(url, callback, readerMode) {

    if (url == null && callback) {
      callback();
    } else {
      SafariView.isAvailable()
        .then(available => SafariView.show({
            url: url,
            readerMode: readerMode,
          }));
    }
  },

  // return an array
  urlify: function(text, style) {
    var urlRegex = /(https?:\/\/[^\s]+)/g, 
        self = this,
        urlified, style = style ? style : {};

    urlified = text.split(urlRegex).map(function(str) {
      if (urlRegex.test(str)) {
        return (<Text style={style} onPress={self.openURL.bind(self, str)}>{str}</Text>);
      } else {
        return str;
      }
    })

    
    return urlified;
  },

  getDeviceWidth: function() {
    return React.Dimensions.get('window').width;
  },
  getDeviceHeight: function() {
    return React.Dimensions.get('window').height;
  }
};

module.exports = Tool;