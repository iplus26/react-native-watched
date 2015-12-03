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
  urlify: function(text, style, m) {

    var pattern = 'https?:\/\/[^\s]+', 
      mentions, mentionedID = [], regURL, regAll, 
      self = this, urlified, props,
      style = style ? style : {};
      
    // 是否有@在广播里
    if (m) {
      mentions = m.mentions; props = m.props;
      mentionedID = mentions.map(function(mention) {
        return '@' + (mention.uid || mention.id);
      });
    }
    
    // regURL 匹配字符串中的URL
    // regAll 匹配字符串中的URL和@
    regURL = new RegExp(pattern, 'g'),
    regAll = new RegExp('(' + (mentionedID.length > 0 ?
          pattern + '|' + mentionedID.join('|') : pattern) + ')', 'g');

    urlified = text.split(regAll).map(function(str) {

      var index, new_props = {};

      for (var prop in props) {
        if (props.hasOwnProperty(prop)){
          new_props[prop] = props[prop];
        }
      } 

      if (regURL.test(str)) {
        return (<Text style={style} onPress={self.openURL.bind(self, str)}>{str}</Text>);
      } else if (mentionedID.indexOf(str) > -1) {
        index = mentionedID.indexOf(str);
        new_props.user = mentions[index];
        return (<Text style={style} onPress={function() {
          props.toRoute({
            component: require('./../User/User'),
            name: '用户主页',
            passProps: new_props,
          })}}>@{mentions[index].screen_name}</Text>);
      } else {
        return str;
      }
    });


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