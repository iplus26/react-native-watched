'use strict';

var React = require('react-native');

var {StyleSheet,
  TouchableHighlight,
  Image,
  View, } = React;

var Config = require('./../lib/Config');

var {Icon} = require('react-native-icons');

var styles = StyleSheet.create({
  backButton: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginTop: 5,
  }
});


var BackButton = React.createClass({
  render() {
    return (
      <Icon name='ion|ios-arrow-back' size={30} color={Config.BASE_COLOR} style={styles.backButton} />
    );
  }
});


module.exports = BackButton;
