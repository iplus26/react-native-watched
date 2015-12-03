'use strict';

var React = require('react-native');
var {Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight, } = React;

var {Icon, } = require('react-native-icons');

// my own components
var MovieDetail = require('./../Movie/MovieDetail');
var IvText = require('./../lib/IvText');
var Tool = require('./../lib/Tool');
var Config = require('./../lib/Config');
var Movie = require('./Attachment/Movie');

// wheels others made
var BlurView = require('react-native-blur').BlurView;

var Attachment = React.createClass({

  _openURL: function(attachment, readerMode) {

    if (attachment.type === 'movie') {

      this.props.toRoute({
        component: MovieDetail,
        name: attachment.title,
        rightCorner: require('./../Movie/components/Share'),
        passProps: {
          movie: {
            id: attachment.expaned_href.match(/\d+/)[0],
          }
        },
        rightCornerProps: {
          href: attachment.expaned_href,
        }
      });

    } else {
      Tool.openURL(attachment.expaned_href, null, readerMode);
    }
  },

  _isFollowUser: function(url) {
    return /http:\/\/www\.douban\.com\/people\/.+\//i.test(url);
  },

  render: function() {

    var attachment = this.props.attachment;

    switch (attachment.type) {
      case 'song': // 推荐单曲
      case 'music':
      case 'book':
      case 'movie' : return <Movie {...this.props}/>
      case '':
        if (this._isFollowUser(attachment.expaned_href)) {
          return this._renderUser(attachment);
        }
      case 'com.douban.group':
      case 'com.douban.book':
      case 'com.douban.people':
      case 'url':
      case 'event':
      case 'photos': // 上传到相册
      case 'rec':
        return this._renderAttachment(attachment);
      case 'com.douban.site': // 推荐日记
        return this._renderAttachment(attachment, true);
      case 'image':
        if (Array.isArray(attachment.media) && attachment.media.length > 0) {

          // 用户的广播发图
          return this._renderImages(attachment.media);

        } else {
          // 不然其实是没有 attachment 的, 也会显示 type: 'image'
          return null;
        }
      default:  return <IvText>- 未知类型</IvText>;
    }

    return null;

  },

  _renderImages: function(images) {

    // 暂时只显示第一张图

    return (
      <View underlayColor='#fff' style={{
            flex: 1, 
            width: images[0].sizes.small[0] ,
            marginTop: 10
          }}>
          <Image style={{
             width: images[0].sizes.small[0] ,
             height: images[0].sizes.small[1] ,
            }} source={{uri: images[0].src }}/>
        </View>);
  },

  _renderUser: function(attachment) {
    var self = this;
    var hasMedia = Array.isArray(attachment.media) &&
    attachment.media.length > 0 && typeof attachment.media[0] === 'object' ? true : null;

    return (
      <View style={{paddingTop: 10, }}>
      <TouchableHighlight onPress = { () => self._openURL(attachment, readerMode || false) }
      underlayColor = '#02b875' activeOpacity = {0}>

      <Image source={{uri: hasMedia && attachment.media[0].original_src }}>      
        <BlurView blurType='xlight' style = {[styles.attachment, {borderWidth: 0}]}>
          <View style={styles.thumbnailContainer}>
          <Image style={[styles.thumbnail, { marginRight: 10, }]} 
          source={{uri: hasMedia && attachment.media[0].original_src  }}/>
          </View>
          <View style={{flex: 2,}}>
            <IvText style = {{fontWeight: '400', }}>{attachment.title}</IvText>
            {function() {
              if(attachment.description)
              return <IvText>{attachment.description.replace(/(\r\n|\n|\r)/gm, " ").trim() }</IvText>
            }()}
            
          </View>
        </BlurView>
      </Image>
      </TouchableHighlight>
      </View>

    );
  },

  _renderAttachment: function(attachment, readerMode) {

    var self = this;
    var hasMedia = Array.isArray(attachment.media) &&
    attachment.media.length > 0 && typeof attachment.media[0] === 'object' ? true : null;

    return (
      <View style={{paddingTop: 10, }}>
      <TouchableHighlight onPress = { () => self._openURL(attachment, readerMode || false) }
      underlayColor = '#82D9B9' activeOpacity = {0}>

      <View style = {styles.attachment}>
          <View style={{flex: 1, }}>
            <IvText style = {{fontWeight: '400', }}>{attachment.title}</IvText>
            {function() {
              if(attachment.description)
              return <IvText>{attachment.description.replace(/(\r\n|\n|\r)/gm, " ").trim() }</IvText>
            }()}
          </View>
        </View>
      </TouchableHighlight>
      </View>

    );

  },

});

var styles = StyleSheet.create({

  attachment: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 2,
    flexDirection: 'row',
    borderColor: Config.GRAY_COLOR,
  },

  thumbnailContainer: {
    alignItems: 'stretch'
  },

  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },

});

module.exports = Attachment;