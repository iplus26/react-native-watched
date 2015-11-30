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