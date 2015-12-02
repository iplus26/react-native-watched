'use strict';

var React = require('react-native');
var View = React.View;

var Spinner = require('react-native-spinkit');

var {Tool, Config, } = require('./../lib/Toolbox');

var Loading = React.createClass({
  render: function() {
    return (

      // jshint ignore: start

      <View style={{ width: Tool.getDeviceWidth(), alignItems: 'center',}}>
        <Spinner isVisible={true} type='Bounce' color={Config.BASE_COLOR} />
      </View>

      // jshint ignore: end

      );
  }
});

module.exports = Loading;