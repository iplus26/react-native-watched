/**
 *   Pass 'query' as a property of 'ExploreListView' to ListView
 */

'use strict';

var React = require('react-native');
var MovieListView = require('./MovieListView');
var dismissKeyboard = require('dismissKeyboard');
var Config = require('./../lib/Config');

var {StyleSheet,
  ScrollView,
  ListView,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Component} = React;

var API_URL = require('./../lib/Config').API_URL + 'v2/movie/search?q=';

var SearchPage = React.createClass({
  getInitialState: function() {
    return {
      query: undefined,
    };
  },

  inputText: '',

  handleTextInputChange: function(event) {
    this.inputText = event.nativeEvent.text;
  },

  render: function() {

    return (
      // jshint ignore: start

      <ScrollView>
        
        <View style={styles.container}>
            <TextInput
                    style={styles.searchInput}
                    placeholder='搜索你感兴趣的电影或人'
                    onSubmitEditing={this.onSubmitEditing}
                    onChange={this.handleTextInputChange}
                    returnKeyType='search' />
          
            <TouchableHighlight
                    style={styles.button}
                    underlayColor='#fff'
                    onPress={() => {  dismissKeyboard(); }}
                    autoFocus={true}>
            
                <Text style={styles.buttonText}>取消</Text>
            
            </TouchableHighlight>
              
        </View>

        <MovieListView {...this.props} query={this.state.query}/>

        </ScrollView>
      // jshint ignore: end
      );
  },

  onSubmitEditing: function(event) {
    this.setState({
      query: this.inputText
    });
    console.log('Searching: ' + this.inputText + ' (onSubmitEditing)');
  },
});


var styles = StyleSheet.create({
  container: {
    margin: 4,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    color: Config.BASE_COLOR,
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
    color: Config.BASE_COLOR,
    borderColor: Config.GRAY_COLOR,
    borderWidth: 1,
  }
});


module.exports = SearchPage;