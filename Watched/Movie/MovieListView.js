/**
 *     Generate a ListView
 */

'use strict';

var React = require('react-native');
var Icon = require('./../lib/Icon');
var Config = require('./../lib/Config');
var Movie = require('./MovieDetail');
var LoadingPage = require('./../Views/LoadingPage');

var BlurView = require('react-native-blur').BlurView;

var {Text,
  ListView,
  View,
  Image,
  StyleSheet,
  TouchableHighlight, } = React;

var API_URL = Config.API_URL + 'v2/movie/search?q=';

var ExploreListView = React.createClass({

  getInitialState: function() {

    // 先从本地存储抓取旧的数据进行显示 

    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false,
    };

  },

  componentDidMount: function() {
    // this.fetchData(encodeURI('Harry Potter'));
  },

  fetchData: function(query) {

    console.log('Fetching data, this.props.query is ' + this.props.query);

    fetch(API_URL + query)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          currentQuery: this.props.query,
          dataSource: this.state.dataSource.cloneWithRows(responseData.subjects),
          loaded: true,
        });
      })
      .done();

  },

  onQuery: function() {

    this.fetchData(encodeURI(this.props.query));

  },

  render: function() {

    // 传入一个 property 'query'

    if (!!this.props.query && this.props.query !== this.state.currentQuery) {
      this.onQuery();
    }

    if (!this.state.loaded) {
      return <LoadingPage/>;
    }

    // 有数据则返回listview
    return (<ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              style={styles.listView} />);
  },

  onEndReached: function() {
    // TODO: not working 
    console.log('Reach End! ');
  },

  renderRow: function(movie, sectionID, rowID) {
    var self = this;
    return (
      // jshint ignore: start
      <TouchableHighlight onPress = { () => {

        self.props.toRoute({
          component: Movie,
          name: movie.title,
          passProps: {movie: movie},
        })

      }} underlayColor='#fff'>
        
        <View style={[styles.rowContainer]}>
             
             <Image source={{ uri: movie.images.small }}
                    style ={styles.thumbnail}/>
            
            <View style={styles.rightContainer}>

            <Text style={styles.title} numberOfLines={1}>
                {movie.title}
            </Text>

            <View style={styles.container}>
            <Text style={styles.desc}>{[movie.year, movie.genres.join('/')].join('/')}</Text>
            </View>

            <View>
            <Text style={styles.desc}>
            { function() {
                var casts = [];
                movie.directors.forEach(function(d) {
                    casts.push(d.name)
                })
                movie.casts.forEach(function(cast) {
                    casts.push(cast.name);
                })
                return casts.join('/');
            }() }
            </Text>
            
            </View>
          </View>
        </View>     
      </TouchableHighlight>
      // jshint ignore: end
      );
  },
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  rightContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    color: Config.BASE_COLOR,
  },
  desc: {
    fontWeight: '100',
  },
  ratingContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  ratingStar: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  thumbnail: {
    width: 70,
    height: 100,
  },
  listView: {
    backgroundColor: '#fff',
  },
  rowContainer: {
    padding: 10,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: Config.GRAY_COLOR,
  },
});

module.exports = ExploreListView;