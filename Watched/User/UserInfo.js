'use strict';

var React = require('react-native');
var {View, Text, ScrollView, StyleSheet, Image, TouchableHighlight, AsyncStorage, } = React;
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

		var addShareBtn = function() {
			return (<TouchableHighlight style={styles.userActionBtn}
				onPress={this.onShare.bind(this, user)}>
				<Icon name='ion|ios-upload-outline' color={Config.BASE_COLOR}
					size={22} style={styles.icon} />
				</TouchableHighlight>)
		}.bind(this)

		var addUserActionBtn = function(){
			if (this.props.user_id === user.id){
				return (
					<TouchableHighlight style={styles.userActionBtn} 
						onPress={this.onLogout.bind(this, user)}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<Icon name='ion|ios-filing-outline' color={Config.BASE_COLOR}
							  size={22} style={styles.icon} />
						<Text style={styles.userActionText}>退出帐号</Text>
					</View>
					</TouchableHighlight>)
			} else if (user.hasOwnProperty('relation')) {
				if (user.relation === 'contact') {
					return (
					<TouchableHighlight style={[styles.userActionBtn, {marginRight: 0}]} 
						onPress={this.onUnfollow.bind(this, user)}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<Icon name='ion|ios-checkmark-empty' color={Config.BASE_COLOR}
							  size={22} style={styles.icon} />
							<Text style={styles.userActionText}>正在关注</Text>
					</View>
					</TouchableHighlight>)
				} 
			} else {
				// 陌生人
				return (
					<TouchableHighlight style={styles.userActionBtn} 
						onPress={this.onFollow.bind(this, user)}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<Icon name='ion|ios-plus-empty' color={Config.BASE_COLOR}
							  size={22} style={styles.icon} />
						<Text style={styles.userActionText}>关注 Ta</Text>
					</View>
					</TouchableHighlight>)
			}
		}.bind(this)

		var addCreateTime = function() {

			var create = '不可知';

			if (user.hasOwnProperty('created') && user.created) {
				var time = moment(user.created, 'YYYY-MM-DD hh:mm:ss').fromNow();
				if (time !== 'Invalid date') create = time;
			}

			if (create) {
				return (<View style={styles.fd}>
					<Icon name='ion|ios-clock-outline' color={'black'}
							  size={22} style={[styles.icon, {paddingLeft: -5, }]} />
					<Text>{create}</Text>
					</View>)
			}

		}.bind(this)

		var addLocation = function() {
			var loc;
			
			if (user.hasOwnProperty('loc_name') && user.loc_name) {
				loc = user.loc_name;
			}

			if (loc) {
				return (<View style={styles.fd}>
					<Icon name='ion|ios-world-outline' color={'black'}
							  size={22} style={styles.icon} />
					<Text>{loc}</Text>
					</View>)
			}
		}

		return (
			<View style={styles.container}>

			<View style={styles.thumbnailContainer} >
			<View style={styles.thumbnailWrapper}>
			<Image style={styles.thumbnail}
				  source={{uri: user.large_avatar || user.avatar}}/>
				  </View>
			</View>

			<View style={{alignItems: 'center', marginBottom: 20, }}>
				<Text style={styles.username}>{user.screen_name || user.name}</Text>
				<Text style={styles.id}>@{user.uid}</Text>
			</View>

			<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30}}>
				{addShareBtn()}{ addUserActionBtn() }
			</View>
			<View style={[styles.fd, {marginBottom: 30}]}>
				{addCreateTime() }{ addLocation() }
				</View>
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

	onShare(user) {
		console.log('分享');
	}

	onLogout() {
		AsyncStorage.multiRemove(['access_token', 'douban_user_name']);
	}
}

var styles = StyleSheet.create({
  fd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Config.BASE_COLOR,
  },

  thumbnailContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },
  thumbnailWrapper: {
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowColor: 'black',
    borderRadius: 7,
    shadowOpacity: 0.8,
  },
  thumbnail: {
    height: 70,
    width: 70,
    borderRadius: 7,
  },

  username: {
    // color: Config.BASE_COLOR,
    fontSize: 20,
    fontWeight: '300',
  },
  id: {
    color: '#77C7AA',
  },
  icon: {
    height: 15,
    width: 15,
    marginRight: 5,
  },
  userActionBtn: {
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: Config.BASE_COLOR,
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    marginRight: 5,
  },
  userActionText: {
    color: Config.BASE_COLOR,
    fontSize: 16,
    fontWeight: '300',
  },
  icon: {
    height: 30,
    width: 30,
  }
});

module.exports = UserInfo;