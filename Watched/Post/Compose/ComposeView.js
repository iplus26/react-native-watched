'use strict';

var React = require('react-native');
var {View,
  TextInput,
  StyleSheet,
  Text,
  AlertIOS,
  TouchableHighlight, } = React;

var Tool = require('./../../lib/Tool');
var Config = require('./../../lib/Config');

var Icon = require('react-native-icons').Icon;

var ComposeView = React.createClass({
  getInitialState: function() {
    return {
      textContent: '',
      textCount: 0,
    };
  },

  // 每次输入都会 re-render this component
  _onChangeText: function(text) {
    this.setState({
      textContent: text,
      textCount: text.length,
    });
    this.props.setRightProps({
      postContent: this.state.textContent,
    });
  },

  render: function() {
    var self = this;
    return (
      <View style={styles.contentWrapper}>
        <TextInput autoFocus={true} multiline={true}
        enablesReturnKeyAutomatically={true}
        placeholder='想什么呢？'
        placeholderTextColor={Config.GRAY_COLOR}
        style={styles.input} 
        onChangeText={this._onChangeText}/>
        <View style={styles.interaction}>

          <Text style={{color: (this.state.textCount <= 140 ? Config.BASE_COLOR : '#F35D50')}}>
            {140 - this.state.textCount}
        </Text>
        </View>
      </View>);
  },

  // 生成输入栏下方的按钮
  _renderInteractionButton: function(iconName) {
    iconName = iconName.replace('ion-', 'ion|');
    return (
      <TouchableHighlight underlayColor='white'>
          <Icon name={iconName} size={30} color={Config.BASE_COLOR} style={styles.icon} />
        </TouchableHighlight>);
  },
});

var styles = StyleSheet.create({
  contentWrapper: {
    padding: 10,
  },
  interaction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 30,
    width: 30,
    margin: 10,
    marginLeft: 0,
  },
  input: {
    height: 200,
    fontSize: 17,
    marginTop: 0,
    fontWeight: '300',
    width: Tool.getDeviceWidth(),
  }
});

module.exports = ComposeView;