'use strict';

var React = require('react-native');
var {TouchableHighlight, StyleSheet} = React;
var {Config, } = require('./../../../lib/Toolbox');

var {Icon, } = require('react-native-icons');

var Search = React.createClass({

  goToSearch: function() {
    this.props.goToSearch();
  },

  render() {
    return (
      <TouchableHighlight underlayColor="transparent" onPress={this.goToSearch}>
        <Icon name='ion|ios-search' size={30} color={Config.BASE_COLOR} style={styles.icon}/>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  icon: {
    height: 30,
    width: 30,
    marginRight: 10,
    marginTop: 5,
  }
})

module.exports = Search;