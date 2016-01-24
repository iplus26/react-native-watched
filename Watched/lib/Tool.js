'use strict';

let React = require('react-native');
let {LinkingIOS,
  Touchablehighlight,
  Text, } = React;

let SafariView = require('react-native-safari-view');

let Tool = {

  // transform a parameter object into string  
  param: function(obj) {
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  },

  extend: function() {
    let copy, prop, i = 0,
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

    console.log(url);

    if (url === null && callback) {
      callback();
    } else {
      SafariView.isAvailable()
        .then(available => SafariView.show({
            url: url,
            readerMode: readerMode,
            tintColor: require('./Config').BASE_COLOR,
          }));
    }
  },

  // return an array
  urlify: function(text, style, m) {

    let pattern = 'https?:\/\/[^\s]+', 
        mentions, mentionedID = [], regURL, regAll, 
        urlified, props;

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

      let index, new_props = {};

      for (let prop in props) {
        if (props.hasOwnProperty(prop)){
          new_props[prop] = props[prop];
        }
      } 

      if (regURL.test(str)) {
        // jshint ignore: start 
        return (<Text style={style} onPress={self.openURL.bind(self, str)}>{str}</Text>);
        // jshint ignore: end
      } else if (mentionedID.indexOf(str) > -1) {
        index = mentionedID.indexOf(str);
        new_props.user = mentions[index];
        // jshint ignore: start 
        return (<Text style={style} onPress={function() {
          props.toRoute({
            component: require('./../User/User'),
            name: '用户主页',
            passProps: new_props,
          })}}>@{mentions[index].screen_name}</Text>);
        // jshint ignore: end
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