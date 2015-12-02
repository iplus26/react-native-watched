'use strict';

var React = require('react-native');
var {View,
  Text,
  TouchableHighlight,
  AsyncStorage,
  LinkingIOS,
  AlertIOS,
  Image,
  ScrollView, } = React;

// my own components 
var Tool = require('./../lib/Tool');
var User = require('./../User/User');
var UserPostsTimeline  = require('./../Post/TimelineListView');

// wheels others made
var SafariView = require('react-native-safari-view');
var BlurView = require('react-native-blur').BlurView;

var ProfilePage = React.createClass({

  getInitialState: function() {
    return {
      login: false,
      douban_user_name: null,
      douban_user: null, 
      access_token: null, 
    };
  },

  componentDidMount: function() {
    this._getLoginInfo();
  },

  _getLoginInfo: function() {

    var self = this;

    AsyncStorage.multiGet(['access_token', 'douban_user_name'], function(err, user) {

      if (!!user[0][1] && !!user[1][1]) {
        fetch('https://api.douban.com/v2/user/~me', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + user[0][1],
          }
        })
          .then((response) => response.json())
          .then((d) => {
            self.setState({
              access_token: user[0][1],
              login: true,
              douban_user_name: user[1][1],
              douban_user: d,
            });
          })
          .done();
      }
    });
  },

  _logout: function() {
    var self = this;

    AsyncStorage.multiRemove(['access_token', 'douban_user_name'], function(err) {

      self.setState({
        access_token: null,
        douban_user: null,
        login: false,
        douban_user_name: null,
      });

    });
  },

  render: function() {
    if (!this.state.login) {
      return (

        // jshint ignore: start
        <ScrollView automaticallyAdjustContentInsets={false}>

          <Text>没有用户数据，</Text>

          <TouchableHighlight onPress={ this.doubanOauth }>
              <Text>登录!</Text>
          </TouchableHighlight>

         </ScrollView>
        // jshint ignore: end
        );
    } else {
      console.log(this.state.douban_user);
      return (
        // jshint ignore: start
        <ScrollView automaticallyAdjustContentInsets={false}>
          <User {...this.props} user={this.state.douban_user}
            access_token={this.state.access_token} 
            user_id={this.state.douban_user.id}/>
        </ScrollView>
        // jshint ignore: end
        );
    }
  },

  doubanOauth: function() {

    var self = this;
    var url = 'https://www.douban.com/service/auth2/auth?' +
      'client_id=001ead17f46422ab005c0747dd2c6801&' +
      'redirect_uri=watched://oauth-callback&' +
      'response_type=code&' +
      'scope=douban_basic_common,movie_basic,shuo_basic_r,shuo_basic_w';

    LinkingIOS.addEventListener('url', _handleUrl);

    LinkingIOS.openURL(url);

    function _handleUrl(event) {

      // 拒绝授权 https://www.example.com/back?error=access_denied
      // 成功授权 https://www.example.com/back?code=9b73a4248

      // 这一段用正则表达式来处理 其实很dirty 应该用更优雅的方式

      var pattern = /watched:\/\/oauth\-callback\?code.*/;
      var match = event.url.match(pattern);

      if (!match) {

        // 授权失败

        AlertIOS.alert('授权失败',
          '你需要登录豆瓣帐号进行授权，方可在「看过」使用豆瓣广播等功能。' +
          '在授权过程中，「看过」不会接触到你的密码等敏感信息。',
          [{
            text: '因为我任性'
          }, {
            text: '再来',
            onPress: self.doubanOauth
          }]);

      } else {

        // 授权成功

        var code = match[0].substring(30);

        console.log('成功获取到 code: ' + code);

        fetch('https://www.douban.com/service/auth2/token', {
          method: 'post',
          body: ([
            'client_id=001ead17f46422ab005c0747dd2c6801&',
            'client_secret=5e58857386133e7e&',
            'redirect_uri=watched://oauth-callback&',
            'grant_type=authorization_code&',
            'code=', code,
          ].join(''))
        })
          .then((response) => response.json())
          .then((d) => {

            console.log('成功获取到 access_token: ' + d.access_token);

            AsyncStorage
              .multiSet([['access_token', d.access_token.toString()],
                ['douban_user_name', d.douban_user_name.toString()]])
              .then(self._getLoginInfo());

          })
          .done();

      }

      LinkingIOS.removeEventListener('url', _handleUrl);
    }

  },

});

module.exports = ProfilePage;