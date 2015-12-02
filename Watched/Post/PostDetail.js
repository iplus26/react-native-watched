'use strict';

var React = require('react-native');
var {View, Text, } = React;

var {Tool, Config, } = require('./../lib/Toolbox');

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchData(this.props.access_token, this.props.id);
  }

  fetchData(token, id, method) {

    var options = {
      pack: false,
    };
    var m = method ? method : 'GET';

    var url = Config.API_URL + 'shuo/v2/statuses/' + id + '?';

    console.info('request: ' + url);

    fetch(url + Tool.param(options), {
      method: m,
      headers: {
        Authorization: 'Bearer ' + token,
      }
    })
      .then((response) => response.json())
      .then((d) => {
        console.log(d);
      });
  }

  render() {
    return <View><Text>here</Text></View>;
  }
}

module.exports = PostDetail;