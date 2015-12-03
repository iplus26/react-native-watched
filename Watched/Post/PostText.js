'use strict';

var React = require('react-native');
var {Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  ActionSheetIOS,
  TouchableHighlight,
  Component, } = React;

var {Tool, Config} = require('./../lib/Toolbox');

class PostText extends Component {
	constructor(props) {
		super(props);
	}

	render() {

		var post = this.props.post,
			text = post.text.trim(),
			urlified;
		
		if (text) {
			urlified = Tool.urlify(text, styles.link, post.entities && 
				{mentions: post.entities.user_mentions, props: this.props});
		} else {
			return null;
		}

		return (<Text {...this.props} style={styles.text}>{urlified}</Text>);

	}
}

var styles = StyleSheet.create({
	link: {
		color: Config.BASE_COLOR, 
	},
	text: {
		paddingTop: 10,
		fontSize: 17,
		fontWeight: '300',
	}
})

module.exports = PostText;