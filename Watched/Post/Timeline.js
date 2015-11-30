'use strict';

var React = require('react-native');
var {Text,
  View,
  ScrollView,
  AsyncStorage,
  ListView,
  StyleSheet,
  TextInput,
  TouchableHighlight, } = React;

// my own components
var LoadingPage = require('./../Views/LoadingPage');
var TimelineListView = require('./TimelineListView');
var MovieListView = require('./../Movie/MovieListView');

// wheels others made
var Spinner = require('react-native-spinkit');

var Timeline = React.createClass({

  getInitialState: function() {
    return {
      login: false,
      douban_user_name: null,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
    };
  },

  _getLoginInfo: function() {

    var self = this;

    AsyncStorage.multiGet(['access_token', 'douban_user_name'], function(err, user) {

      if (!!user[0][1] && !!user[1][1]) {

        self.props.setRightProps({
          token: user[0][1],
        });

        self.setState({
          login: true,
          access_token: user[0][1],
          douban_user_name: user[1][1],
        });
      }
    });

  },

  render: function() {

    if (this.state.login) {
      // jshint ignore: start
      return (
        <View style={{ flex: 1, marginTop: 0, marginBottom: 49, }}>
          <TimelineListView {...this.props} access_token={this.state.access_token}/>
        </View>);
    // jshint ignore: end
    } else {
      this._getLoginInfo();
      // jshint ignore: start
      return <LoadingPage />;
    // jshint ignore: end
    }
  },
});

var styles = StyleSheet.create({
  container: {
    margin: 4,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#414A8C',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    color: '#84d8d0',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    width: 40,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    flex: 1,
    fontSize: 16,
    backgroundColor: '#4D559B',
    color: '#84d8d0',
  }
});

module.exports = Timeline;