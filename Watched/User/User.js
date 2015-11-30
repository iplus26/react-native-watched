'use strict';

var React = require('react-native');
var {View, Text, } = React;

var User = React.createClass({
	getInitialState: function(){
		return {
			user: null,
		}
	},

	componentDidMount: function() {
		this.setState({
			user: null,
		})
	},

	render: function() {
		if (this.state.user) {
			return (<View><Text>有用户数据</Text></View>)
		} else {
			return (<View><Text>没有用户数据</Text></View>)
		}
	},
});

module.exports = User;