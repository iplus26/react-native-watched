'use strict';

var React = require('react-native');
var {StyleSheet,
  TouchableHighlight,
  ActionSheetIOS, } = React;
var {Icon, } = require('react-native-icons');
var Config = require('./../../lib/Config');

var ShareIcon = React.createClass({

  _showShareActionSheet() {
    if (this.props && this.props.hasOwnProperty('href')) {
      ActionSheetIOS.showShareActionSheetWithOptions({
        url: this.props.href
      },
        (error) => {
          console.error(error);
        },
        (success, method) => {
          var text;
          if (success) {
            text = `Shared via ${method}`;
          } else {
            text = 'You didn\'t share';
          }
          this.setState({
            text
          });
        });
    }
  },
  render: function() {
    return (
      <TouchableHighlight onPress={this._showShareActionSheet} underlayColor="transparent">
        <Icon name='ion|ios-upload-outline' size={30} color={Config.BASE_COLOR} style={styles.icon}/>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    marginTop: 5,
    marginRight: 10
  }
});

module.exports = ShareIcon;