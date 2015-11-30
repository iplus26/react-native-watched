'use strict';

var React = require('react-native');
var Text = React.Text;

var IvText = React.createClass({
  render: function() {
    return (
      <Text style = {[{fontSize: 17, fontWeight: '300', }, this.props.style ]} >{this.props.children}</Text>
    );
  }
});

module.exports = IvText;