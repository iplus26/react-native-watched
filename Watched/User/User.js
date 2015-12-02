'use strict';

var React = require('react-native');
var {View, Text, ScrollView, StyleSheet, } = React;
var PostTimeline = require('./../Post/TimelineListView');
var UserInfo = require('./UserInfo');

class User extends React.Component {
	constructor (props) {
		super(props);
	}

	render() {
		return (
			<ScrollView automaticallyAdjustContentInsets={false} style={styles.container}>
				<UserInfo {...this.props} />
				<PostTimeline {...this.props} user_id={this.props.user.id}/>
			</ScrollView>
		)
	}
}

var styles = StyleSheet.create({
	container: {
		marginBottom: 49,
	}
})

module.exports = User;