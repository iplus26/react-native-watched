'use strict';

var React = require('react-native');
var {View,
  Text,
  Component,
  TouchableHighlight,
  Image,
  StyleSheet, } = React;

var IvText = require('./../../lib/IvText');

var BlurView = require('react-native-blur').BlurView;

class Movie extends Component {
  constructor(props) {
    super(props);
  }

  openURL(attachment, readerMode) {

    if (attachment.type === 'movie') {

      this.props.toRoute({
        component: require('./../../Movie/MovieDetail'),
        name: attachment.title,
        rightCorner: require('./../../Movie/components/Share'),
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
  }

  render() {
    var movie = this.props.attachment,
      self = this,
      readerMode = false,
      hasMedia = Array.isArray(movie.media) && movie.media.length > 0 &&
      typeof movie.media[0] === 'object' ? true : null;

    return (
      <View style={{paddingTop: 10, }}>
	      <TouchableHighlight onPress = { () => self.openURL(movie, readerMode || false) }
	      underlayColor = 'white' activeOpacity = {0}>

	      <Image source={{uri: hasMedia && movie.media[0].original_src }}>      
	        <BlurView blurType='xlight' style = {styles.movie}>
	          <View style={styles.thumbnailContainer}>
	          <Image style={{
	            // 这里的样式有问题 缩略图并不是始终等宽 但是我在这里用不好flexbox
	            width: 60, 
	            height: hasMedia && 60 / movie.media[0].sizes.raw[0] * movie.media[0].sizes.raw[1],
	            marginRight: 10,
	          }} source={{uri: hasMedia && movie.media[0].original_src}}/>
	          </View>
	          <View style={{flex: 2,}}>
	            <IvText style = {{fontWeight: '400', }}>{movie.title}</IvText>
	            {function() {
	              if(movie.description)
	              return <IvText>{movie.description.replace(/(\r\n|\n|\r)/gm, " ").trim() }</IvText>
	            }()}
	            
	          </View>
	        </BlurView>
	      </Image>
	      </TouchableHighlight>
	  </View>);
  }
}

var styles = StyleSheet.create({
  thumbnailContainer: {
    alignItems: 'stretch',
  }, 
  movie: {
    padding: 10,
    flexDirection: 'row',
  },
});

module.exports = Movie;