'use strict';

var React = require('react-native');
var {View, Text, TouchableHighlight, StyleSheet, } = React;
var {Config, Tool, } = require('./../lib/Toolbox');

class Description extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showMore: false,
		}
	}

	render () {

		var self = this,
				long = this.props.desc || '', 
				tooLong = long.length >= 50,
				showMore = this.state.showMore,
				short = tooLong ? long.substring(0, 50)
				.replace(/(\n\n\n\n\n|\n\n\n\n|\n\n\n|\n\n)/gm, '\n').trim() + '...' : long;

		var showMoreInfo = function() { self.setState({showMore: true});  }
		var showLessInfo = function() { self.setState({showMore: false}); }
		var renderBtn = function() {
			if (tooLong) {
				return (<TouchableHighlight underlayColor='white'
					onPress={showMore ? showLessInfo : showMoreInfo}>
					<Text style={styles.knowMoreBtn}>{showMore ? '收起' : '显示全部'}</Text>
				</TouchableHighlight>)
			}
		}

		return (
			<View>
			{/*<Text style={styles.leftQM} >{'\u201C'}</Text>*/}
			<View>
				<Text style={styles.description}>
					{Tool.urlify(showMore ? long : short, styles.link)}
				</Text>
				{renderBtn()}
			</View>
			{/*<Text style={styles.rightQM}>{'\u201D'}</Text>*/}
			</View>)
	}
}


var styles = StyleSheet.create({
	leftQM: {
		fontFamily: '苹方-简', fontSize: 50, marginTop: 10, marginBottom: -30,
	},
	rightQM: {
		fontFamily: '苹方-简', fontSize: 50, textAlign: 'right',
	},
	description: {
		fontSize: 16,
		fontWeight: '300',
		// marginLeft: 20,
	},
	knowMoreBtn: {
		marginLeft: 20,
		marginTop: 10,
		color: Config.BASE_COLOR, 
	},
	link: {
		color: Config.BASE_COLOR, 
	},
})

module.exports = Description;