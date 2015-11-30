'use strict';

var React = require('react-native');
var {View, Text, TouchableHighlight, } = React;

var Settings = React.createClass({
	render: function(){
		return (
			<View>
				<Text>这里是设置</Text>

				<TouchableHighlight><Text>捐赠</Text></TouchableHighlight>
			</View>
		)
	},
})

module.exports = Settings;