// 这是 ComposeView 左上角的发送图标

'use strict';

var React = require('react-native');
var {StyleSheet,
  TouchableHighlight,
  ActionSheetIOS,
  AlertIOS,
  View,
  Text, } = React;

var {Config,
  Tool} = require('./../../lib/Toolbox');

var {Icon, } = require('react-native-icons');
var TimelinePage = require('./../Timeline');
var ComposeIcon = require('./Compose');

var SubmitIcon = React.createClass({

  getInitialState: function() {
    return {
      sent: false,
    };
  },

  // 发送新广播
  _onSubmit: function() {

    var postContent = {
      text: (this.props.postContent + ' - #来自看过:P#'),
      source: Config.API_KEY,
    };

    fetch(Config.API_URL + 'shuo/v2/statuses/', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
      body: Tool.param(postContent),
    })
      .then(response => response.json())
      .then(d => this.setState({
          sent: true,
        }))
      .done();
  },

  render: function() {
    return (
      <TouchableHighlight onPress={this._onSubmit} underlayColor='transparent'>
        <Icon name={this.state.sent ? 'ion|ios-checkmark-outline' : 'ion|ios-paperplane-outline'} size={30} color={Config.BASE_COLOR} style={styles.icon}/>
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

module.exports = SubmitIcon;