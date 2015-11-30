// 这是 TimelineView 里面左上角的"撰写"图标

'use strict';

var React = require('react-native');
var {TouchableHighlight,
  Image,
  StyleSheet,
  Navigator, } = React;

var Config = require('./../../lib/Config');
var ComposeView = require('./ComposeView');
var Icon = require('react-native-icons').Icon;

var ComposeIcon = React.createClass({
  _composePost: function() {
    this.props.toRoute({
      component: ComposeView,
      name: '撰写新广播',
      rightCorner: require('./Submit'),
      rightCornerProps: this.props,
    });
  },
  render: function() {
    return (
      <TouchableHighlight onPress={this._composePost} underlayColor="transparent">
        <Icon name='ion|ios-compose-outline' size={30} color={Config.BASE_COLOR} style={styles.icon}/>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  icon: {
    tintColor: Config.BASE_COLOR,
    width: 30,
    height: 30,
    marginTop: 5,
    marginRight: 10,
  }
});

module.exports = ComposeIcon;