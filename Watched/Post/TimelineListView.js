// 调用这个component, 
// 需要传入参数this.props.access_token (required)
//         & this.props.user_id (optional)

'use strict';

var React = require('react-native');
var {Text,
  View,
  Image,
  ListView,
  StyleSheet,
  ScrollView,
  ActionSheetIOS,
  TouchableHighlight, } = React;

// my own components
var {Tool,
  Config, } = require('./../lib/Toolbox');
var IvText = require('./../lib/IvText');
var Attachment = require('./Attachment');
var Interaction = require('./Interaction');
var LoadingPage = require('./../Views/LoadingPage');
var MovieDetail = require('./../Movie/MovieDetail');

// wheels made by others
var moment = require('moment');
var Spinner = require('react-native-spinkit');
var RefreshableListView = require('react-native-refreshable-listview');

var ds = null;
var couldLoadMorePosts = true;

var TimelineListView = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    // 获取广播
    this.fetchData(this.props.access_token, null, this.props.user_id);
  },

  _onLoad: function() {
    // timeline 顶部下拉刷新
    this.fetchData(this.props.access_token, {
      since_id: ds[0].id
    }, this.props.user_id);
  },

  _onEndReached: function() {
    // timeline 到底时获取更早的广播
    console.log('广播列表到底，获取更多内容...');
    // this.fetchData(this.props.access_token, {
    //   until_id: ds[ds.length - 1].id,
    // }, this.props.user_id);
  },

  fetchData: function(token, options, user_id) {

    var self = this;
    var url = Config.API_URL +
      (user_id ? 'shuo/v2/statuses/user_timeline/' + user_id : 'shuo/v2/statuses/home_timeline') + '?';
    console.log('url: ' + url);

    if (couldLoadMorePosts) {
      couldLoadMorePosts = false;
      fetch(url + Tool.param(options), {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
        .then((response) => response.json())
        .then((d) => {

          // console.log(d);

          if (Array.isArray(d) && d.length > 0) {
            if (Array.isArray(ds) && ds.length > 0) {
              ds = d[0].id > ds[0].id ? d.concat(ds) : ds.concat(d);
            } else {
              ds = d;
            }

            self.setState({
              loaded: true,
              dataSource: this.state.dataSource.cloneWithRows(ds),
            });
          } else {
            console.log('获取广播失败... ');
            console.log(d);
          }

          couldLoadMorePosts = true;

        })
        .done();
    }
  },

  _renderRow: function(post, sectionID, rowID) {

    var self = this;
    var onLongPress = function() {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['取消', '赞', '评论', '转播', '复制', '删除'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 5,
      }, (buttonIndex) => {
        console.log(buttonIndex);
      });
    };
    var onPress = function() {
      this.props.toRoute({
        name: '详情',
        component: require('./PostDetail'),
      });
    }.bind(this);

    return (
      <TouchableHighlight onLongPress={onLongPress}
              underlayColor = '#fff'
              onPress={onPress}>
        {self._renderContent(post)}
      </TouchableHighlight>);

  },

  _renderContent: function(post) {

    var reshared = post.reshared_status && typeof post.reshared_status === 'object';
    var reshare_header = reshared ? (
      <View style = {[styles.cell, {borderBottomWidth: 0, paddingBottom: 0, }]}>
              <Image style = {{marginLeft: 30, width: 20, height: 20, borderRadius: 5, }} 
                  source = {{uri: post.user.small_avatar}} />
              <Text style = {{ marginLeft: 10, }}>
                  {post.user.screen_name} 转播了</Text>
            </View>) : null;
    var post = reshared ? post.reshared_status : post;
    var id = post.user.uid ? (<Text style={{color: Config.GRAY_COLOR, flex: 2, textAlign: 'left', }}>
            @{post.user.uid}</Text>) : null;

    return (
      <View>
        {reshare_header}
        <View style={ styles.cell }>

          <Image style={ styles.thumbnail } 
                      source={{uri: post.user.large_avatar || post.user.small_avatar}} />
      
          <View style = {styles.contentWrapper}>
      
          <View style = {{flexDirection: 'row', alignItems: 'center', }}>
          <IvText numberOfLines = {1} style={{color: Config.BASE_COLOR, marginRight: 2, fontWeight: '400', }}>
            {post.user.screen_name}
          </IvText>
          { this._renderTitle.call(this, post.title) }
          </View>

          <View style = {{justifyContent: 'center', flexDirection: 'row', }}>
          {id}{this._renderTime.call(this, post.created_at)}
          </View>

          { this._renderAttachments(post.attachments[0]) }
      
          { function () {
            if (post.text) {
              return <IvText style={{marginTop: 10, }}>
              {post.text.replace(/(\r\n|\n|\r)/gm, " ").trim()}</IvText>
            }
          } ()}

          <Interaction data={post} token={this.props.access_token}/>
          
          </View>
        </View>
      </View>);
  },

  _renderAttachments: function(attachment) {

    // 根据每一条 post 的 attachments 属性来显示不同的内容, 
    if (attachment) {
      return <Attachment {...this.props} attachment = {attachment}/>;
    }

  },

  _renderTime: function(created_at) {
    moment.locale('en', {
      relativeTime: {
        past: "%s前",
        s: "1秒",
        ss: '%d秒',
        m: "1分钟",
        mm: "%d分钟",
        h: "1小时",
        hh: "%d小时",
        d: "1天",
        dd: "%d天",
        M: "1个月",
        MM: "%d个月",
        y: "1年",
        yy: "%d年",
      }
    });
    var time = moment(created_at, 'YYYY-MM-DD hh:mm:ss').fromNow();

    return (<Text style={{color: Config.GRAY_COLOR, flex: 1, textAlign: 'right', }}>
      {time}</Text>);
  },

  _renderTitle: function(title) {
    var action = title.replace(/\[score\](\d)\[\/score\]/, function(match, score) {
      var str = '';
      if (score > 0) {
        for (var i = 0; i < score; i++) {
          str += '\u2605';
        }
        for (i = 0; i < 5 - score; i++) {
          str += '\u2606';
        }
      }
      return str;
    });

    if (action !== '说：') {
      return (<Text style={{color: '#000', }}>{action}</Text>);
    }
  },

  render: function() {

    if (this.state.loaded) {

      var self = this;

      return (
        // jshint ignore: start
        <RefreshableListView
         removeClippedSubviews={true}
          dataSource = {this.state.dataSource}
          renderRow = {this._renderRow}
          loadData={this._onLoad}
          refreshingIndictatorComponent={
            <View style={{alignItems: 'center', }}>
              <Spinner isVisible={true} type={'Bounce'} color={Config.BASE_COLOR}/>
            </View>}
          style={styles.listView}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={4} //
        />
        // jshint ignore: end
        );

    } else {

      return <ScrollView><LoadingPage /></ScrollView>;

    }
  },

});

var styles = StyleSheet.create({
  listView: {
    flex: 1,
  },

  cell: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#E3E3E5',
    flexDirection: 'row',
    padding: 10,
  },

  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },

  contentWrapper: {
    flex: 1,
    marginLeft: 10,
  },

});


module.exports = TimelineListView;