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
var {Tool, Config, } = require('./../lib/Toolbox');
var IvText = require('./../lib/IvText');
var Attachment = require('./Attachment');
var Interaction = require('./Interaction');
var LoadingPage = require('./../Views/LoadingPage');
var MovieDetail = require('./../Movie/MovieDetail');
var UserThumbnail = require('./components/UserThumbnail');
var PostText = require('./PostText');

// wheels made by others
var Spinner = require('react-native-spinkit');
var moment = require('moment'); require('moment/locale/zh-cn');
var RefreshableListView = require('react-native-refreshable-listview');

var TimelineListView = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false,
    };
  },

  dataCache: [],
  couldLoadMorePosts: true, 
  lastRenderedRowID: -1,

  componentDidMount: function() {
    var f = function() {
      this.fetchData(this.props.user_id, null);
    }.bind(this);
    // 获取广播
    if (this.props.user_id) {
      setTimeout(f, 300);
    } else {
      f();
    }
  },

  onLoad: function() {

    this.fetchData(this.props.user_id, {
        since_id: this.dataCache[0].id
      });

  },

  hasMore: function() {
    return this.dataCache.length > this.lastRenderedRowID + 1
  },

  _onEndReached: function() {
    if (!this.hasMore()) 
    console.log(this.hasMore() + '广播列表到底，获取更多内容...');
    // this.fetchData(this.props.access_token, {
    //   until_id: ds[ds.length - 1].id,
    // }, this.props.user_id);
  },

  fetchData: function(user_id, options) {

    var self = this;
    var token = this.props.access_token;
    var url = Config.API_URL +
      (user_id ? 'shuo/v2/statuses/user_timeline/' + user_id : 
      'shuo/v2/statuses/home_timeline') + '?';
    console.log('url: ' + url);

    if (this.couldLoadMorePosts) {
      this.couldLoadMorePosts = false;
      fetch(url + Tool.param(options), {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
        .then((response) => response.json())
        .then((d) => {

         //  console.log(d)
          
          var cache = self.dataCache;

          if (Array.isArray(d) && d.length > 0) {
            if (Array.isArray(cache) && cache.length > 0) {
              cache = d[0].id > cache[0].id ? d.concat(cache) : cache.concat(d);
            } else {
              cache = d;
            }

            self.setState({
              loaded: true,
              dataSource: this.state.dataSource.cloneWithRows(cache),
            });

          } else {

            console.log('没有新广播/获取广播失败... ');
            console.log(d);
          
          }

          self.dataCache = cache;
          self.couldLoadMorePosts = true;

        })
        .done();
    }
  },

  renderRow: function(post, sectionID, rowID) {

    // console.log(rowID);

    this.lastRenderedRowID = parseInt(rowID) > this.lastRenderedRowID ? 
    parseInt(rowID) : this.lastRenderedRowID;

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
        passProps: Tool.extend(this.props, {id: post.id}),
      });
    }.bind(this);

    return (
      <TouchableHighlight onLongPress={onLongPress}
              underlayColor = '#fff'>
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

          <UserThumbnail {...this.props} user={post.user} />
      
          <View style = {styles.contentWrapper}>
      
          <View style = {{flexDirection: 'row', alignItems: 'center', }}>
          <IvText numberOfLines = {1} style={{
            color: Config.BASE_COLOR, marginRight: 2, fontWeight: '400', }}>
            {post.user.screen_name}
          </IvText>
          { this._renderTitle.call(this, post.title) }
          </View>

          <View style = {{justifyContent: 'center', flexDirection: 'row', }}>
          {id}{this.renderTime.call(this, post.created_at)}
          </View>

          { this._renderAttachments(post.attachments[0]) }

          <PostText {...this.props} post={post} />
          
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

  renderTime: function(created_at) {
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

      // 加载完成

      var self = this;

      return (
        <RefreshableListView
          removeClippedSubviews={true}
          dataSource = {this.state.dataSource}
          renderRow = {this.renderRow}
          loadData={this.onLoad}
          refreshingIndictatorComponent={<LoadingPage />}
          style={styles.listView}
          onEndReached={this._onEndReached}
          // onEndReachedThreshold={0}
        />
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

  contentWrapper: {
    flex: 1,
    marginLeft: 10,
  },

});


module.exports = TimelineListView;