// 用户头像的组件

'use strict';

var React = require('react-native');
var {View, Text, Image, StyleSheet, TouchableHighlight, } = React;
var {Tool, Config, } = require('./../../lib/Toolbox');

class UserThumbnail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

  	var user = this.props.user;
  	var onPress = (function() {
  	  		this.props.toRoute({
  	  			component: require('./../../User/User'),
  	  			passProps: this.props,
  	  			name: '个人资料',
  	  			// headerStyle: {backgroundColor: Config.BASE_COLOR},
  	  		});
  	  	}).bind(this);

  	return (
  	  <TouchableHighlight onPress={onPress}>
  		<Image style={ styles.thumbnail } 
               source={{uri: user.large_avatar || user.small_avatar}} />
      </TouchableHighlight>)
  }
}

var styles = StyleSheet.create({
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
})

module.exports = UserThumbnail;