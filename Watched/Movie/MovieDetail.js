/**
 *    Movie Detail Page
 */
'use strict';
var React = require('react-native');

var Tool = require('./../lib/Tool');
var Config = require('./../lib/Config');
var IvText = require('./../lib/IvText');
var LoadingPage = require('./../Views/LoadingPage');
var Cast = require('./Cast.js');

var {BlurView,
  VibrancyView} = require('react-native-blur');

var {Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  View,
  AlertIOS,
  Dimensions,
  LinkingIOS,
  SwitchIOS, } = React;

var deviceWidth = Dimensions.get('window').width;

var MovieDetail = React.createClass({

  getInitialState: () => {
    return {
      dataSource: null,
      detailed: false,
    };
  },

  componentDidMount: function() {

    // 获取影片的详细信息
    this._getMovieDetail(this.props.movie.id);

  },

  _getMovieDetail: function(id) {

    fetch('http://api.douban.com/v2/movie/subject/' + id)
      .then((response) => response.json())
      .then((responseData) => {

        // this.state 的改变会触发页面的 re-render
        // 将获取到的信息展现出来
        this.setState({
          detailed: true,
          dataSource: {
            movie: responseData
          }
        });

      })
      .done();
  },

  render: function() {

    console.log('rendered! ');

    if (!this.state.detailed) {
      return (

        // 影片信息尚未加载好

        // jshint ignore: start
        <ScrollView><LoadingPage /></ScrollView>
        // jshint ignore: end
        );

    } else {

      // 影片信息加载完成
      // this.state 的改变会触发 re-render 到达此处


      console.log(this.props);
      var movie = this.state.dataSource.movie;

      return (
        // jshint ignore: start
        <ScrollView style={styles.container}>
        
        <TouchableHighlight  onPress={ () => Tool.openURL(movie.alt)}>
        <View style={styles.overviewContainer}>

          <View style={styles.thumbnailWrapper}>
          <Image source={{ uri: movie.images.large || movie.images.medium || movie.images.small }}
                    style={{flex: 1, }} resizeMode = 'cover'/>
          </View>

            <Image source = {{uri: movie.images.large || movie.images.medium || movie.images.small }}
             style = {{ height: deviceWidth * 0.546, width: deviceWidth * 0.618}}>
             <VibrancyView blurType="light" style={styles.blurView}>
                  <Text style = {{width: Tool.getDeviceWidth() * 0.494, 
                    textAlign: 'center', }} numberOfLines = {1}>
                    { movie.year && movie.original_title ? [movie.year, movie.original_title].join(' · ') :
                      (movie.year ? movie.year : movie.original_title)}
                  </Text>
              
                  <Text style={{fontSize: 60, fontWeight: '200',}}>
                    { (movie.rating && movie.rating.average ) ? movie.rating.average : '-'}
                  </Text>
                
                  <Text>
                  {movie.ratings_count ? movie.ratings_count + ' 人评分' : ''}</Text>
           </VibrancyView>
          </Image>
        </View>
        </TouchableHighlight>

        <Cast movie={movie}/>

        <Board movie={movie}/>

        <View style={[styles.block, {marginBottom: 15, }]}>

          <Text style = {styles.title}>
            剧情梗概
          </Text>

          <IvText style = {styles.summaryText}>{movie.summary}</IvText>

        </View>
      </ScrollView>
        // jshint ignore: end
        );
    }
  },



});



var Board = React.createClass({

  render: function() {

    var movie = this.props.movie;

    return (
      //jshint ignore: start
      <View style={[styles.block]}>

      {this._renderCountBlock([{
          num: movie.ratings_count.toLocaleString(), 
          description: '人评分'
        }, {
          num: movie.collect_count.toLocaleString(),
          description: '人看过'
        }])}

      {this._renderCountBlock([{
          num: movie.comments_count.toLocaleString(),
          description: '篇短评',
      }, {
          num: movie.wish_count.toLocaleString(),
          description: '人想看',
      }])}
      </View>
      //jshint ignore: end
      );
  },

  _renderCountBlock: function(dataArray) {
    return (<View style={{flexDirection: 'row'}}>
      <View style={styles.countBlock}>
        <Text style={styles.countNumber}>{dataArray[0].num}</Text>
        <Text>{dataArray[0].description}</Text>
      </View>
      <View style={styles.countBlock}>
        <Text style={styles.countNumber}>{dataArray[1].num}</Text>
        <Text>{dataArray[1].description}</Text>
      </View>
      </View>);
  },

});

var styles = StyleSheet.create({

  container: {

    backgroundColor: '#EFEFF4',
    marginBottom: 49,

  },

  blurView: {

    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',

  },

  overviewContainer: {

    // 概览

    alignItems: 'center',
    flexDirection: 'row',

  },

  thumbnailWrapper: {

    // 海报Wrapper
    width: Tool.getDeviceWidth() * 0.382,
    height: Tool.getDeviceWidth() * 0.546,
    flex: 1,

  },

  block: {

    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 15,
    borderColor: '#E3E3E5',

  },

  title: {

    letterSpacing: 2,
    margin: 10,

  },

  summaryText: {
    margin: 10,
    marginTop: 0,
  },

  countBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
  },

  countNumber: {
    fontSize: 30,
    fontWeight: '300',
    color: Config.BASE_COLOR,
  },

});

module.exports = MovieDetail;