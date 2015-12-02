'use strict';

var React = require('react-native');
var {View, Text, ScrollView, StyleSheet, Image, TouchableHighlight, } = React;
var {Config, } = require('./../lib/Toolbox');
var Description = require('./Description');

var {Icon} = require('react-native-icons');

var moment = require('moment'); require('moment/locale/zh-cn');

class UserInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loadedFullUserInfo: false,
			loadFailed: false, 
			user: {},
		};
	}

	fetchData() {
		var self = this,
			user = this.props.user,
			token = this.props.access_token,
			url = Config.API_URL + 'v2/user/' + user.id;

		fetch(url, {
		  method: 'GET',
		  headers: {
		    Authorization: 'Bearer ' + token,
		  }
		})
		.then((response) => response.json())
        .then((d) => {

        	// 获取用户详细信息返回数据
        	console.log(d);

        	if (d.hasOwnProperty('msg')){
        		self.setState({
        			loadFailed: true,
        		});
        	} else {
	        	self.setState({
	        		loadedFullUserInfo: true,
	        		user: d,
	        	});
        	}
        })
        .done();
	}

	render() {

		var user;

		if (this.state.loadedFullUserInfo) {
		  user = this.state.user;
		} else {
		  user = this.props.user;
		  if (!this.state.loadFailed) {
		    this.fetchData();
		  }
		}

		var showFullUserInfo = function() {
			if (this.state.loadedFullUserInfo) {
				return (<View style={{flexDirection: 'row'}}>
					<Icon name='ion|ios-location' color={Config.BASE_COLOR} 
					style={styles.icon} size={15}/>
					<Text>{user.loc_name || '未知'}</Text>
					<Icon name='ion|edit' color={Config.BASE_COLOR}
					style={styles.icon} size={15}/>
					<Text>{user.signature}</Text>
					</View>)
			}

		}.bind(this)

		var addUserActionBtn = function(){
			if (user.hasOwnProperty('relation')) {
				if (user.relation === 'contact') {
					return (
						<TouchableHighlight style={styles.userActionBtn} 
								onPress={this.onUnfollow.bind(this, user)}>
							<Text style={styles.userActionText}>正在关注</Text>
						</TouchableHighlight>)
				} 
			} else {
				// 陌生人
				return (
						<TouchableHighlight style={styles.userActionBtn} 
								onPress={this.onFollow.bind(this, user)}>
							<Text style={styles.userActionText}>关注 Ta</Text>
						</TouchableHighlight>)
			}
		}.bind(this)

		var addCreateTimeAndLoc = function() {

			var joinStr, locStr, str;

			if (user.hasOwnProperty('created') && user.created) {
				var time = moment(user.created, 'YYYY-MM-DD hh:mm:ss').fromNow();
				if (time !== 'Invalid date') joinStr = time + '加入豆瓣';
			}

			if (user.hasOwnProperty('loc_name') && user.loc_name) {
				locStr = user.loc_name;
			}

			str = [joinStr, locStr].filter(function(str) {
				return !!str;
			}).join(' | ')

			return <Text>{str}</Text>
		}.bind(this)

		return (
			<View style={styles.container}>

			<Image style={styles.thumbnail}
				  source={{uri: user.large_avatar || user.small_avatar}}/>

			<View style={{flexDirection: 'row'}}>
				<View style={{flex: 1}}>
				<Text style={styles.username}>{user.screen_name || user.name}</Text>
				<Text style={styles.id}>@{user.uid}</Text>
				</View>
				<View style={{flex: 1, alignItems: 'flex-end', }}>
				{ addUserActionBtn() }
				</View>
			</View>
				{ addCreateTimeAndLoc() }
			<Description desc={user.desc} />
			</View>)
	}

	// 取消关注
	onUnfollow(user) {
		console.log('取消关注');
	}

	// 关注一个人
	onFollow(user) {
		console.log('关注Ta');
	}
}

var styles = StyleSheet.create({
	container: {
		paddingTop: 25, paddingBottom: 0, 
		paddingLeft: 10, paddingRight: 10,
		borderBottomWidth: 1,
		borderColor: Config.GRAY_COLOR,
	},
	thumbnail: {
		height: 70,
		width: 70,
		borderRadius: 7,
		marginBottom: 15,
	},
	username : {
		// color: Config.BASE_COLOR,
		fontSize: 20,
		fontWeight: '300',
	},
	id: {
		color: 'gray',
	},
	icon: {
		height: 15,
		width: 15,
		marginRight: 5,
	},
	userActionBtn: {
		padding: 5,
		borderWidth: 1,
		borderColor: Config.BASE_COLOR,
		borderRadius: 2,
	},
	userActionText: {
		color: Config.BASE_COLOR,
		fontSize: 16,
		fontWeight: '300',
	}
})

module.exports = UserInfo;