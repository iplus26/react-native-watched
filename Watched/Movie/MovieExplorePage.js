// 没有用！！！

'use strict';

var React = require('react-native');
var {View,
  StyleSheet,
  Text,
  ScrollView, } = React;

var MovieListView = require('./MovieListView');

var MovieExplorePage = React.createClass({
  render: function() {
    return (
      // jshint ignore: start
      <ScrollView style={{
        backgroundColor: '#414A8C'
      }}>
          <MovieListView/>
        </ScrollView>
      // jshint ignore: end
      );

  },


});

module.exports = MovieExplorePage;