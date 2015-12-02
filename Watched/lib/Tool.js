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

  openURL: function(url, func, readerMode) {

    if (url == null) {
      func();
    } else {
      SafariView.isAvailable()
        .then(available => SafariView.show({
            url: url,
            readerMode: readerMode,
          }));
    }
  },

  urlify: function(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    var self = this;
    return text.replace(urlRegex, function(url) {
      return (
        <Touchablehighlight onPress={ (url) => self.openURL(url) }>
          <Text>url</Text>
        </Touchablehighlight>);
    });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
  },

  getDeviceWidth: function() {
    return React.Dimensions.get('window').width;
  },
  getDeviceHeight: function() {
    return React.Dimensions.get('window').height;
  }
};

module.exports = Tool;