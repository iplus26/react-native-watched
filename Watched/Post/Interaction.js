'use strict';

var React = require('react-native');
var {Text,
  View,
  AlertIOS,
  StyleSheet,
  TouchableHighlight, } = React;

var Config = require('./../lib/Config');

var Interaction = React.createClass({

  getInitialState: function() {
    return {
      liked: false,
      reshared: false,
    };
  },

  componentDidMount: function() {
    this.setState({
      liked: this.props.data.liked,
      like_count: this.props.data.like_count,
      reshared: this.props.data.hasOwnProperty('reshare_id'),
      reshared_count: this.props.data.reshared_count || 0,
    });
  },

  _like: function(id) {

    // 赞 function

    var liked = this.state.liked;

    fetch(Config.API_URL + 'shuo/v2/statuses/' + id.toString() + '/like', {
      method: liked ? 'DELETE' : 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      }
    })
      .then((response) => response.json())
      .then(d => this.setState({
          liked: d.hasOwnProperty('liked') ? d.liked : this.state.liked,
          like_count: d.hasOwnProperty('like_count') ? d.like_count : this.state.like_count,
        }))
      .done();
  },

  _reshare: function(id, reshare_id) {

    // 转播 function

    // id 是被转播的那条的 id
    // reshare_id 是转播之后那条的 id

    var self = this;

    if (!this.state.reshared) {

      AlertIOS.alert('确定', '确定要转播吗', [{
        text: '取消',
        onPress: () => console.log('取消转播')
      }, {
        text: '转播',
        onPress: () => fetch(Config.API_URL + 'shuo/v2/statuses/' + id.toString() + '/reshare', {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            }
          })
            .then((response) => response.json())
            .then(d => {

              // console.log(d);

              // 感觉还是有 bug, 不能根据 id 来判断
              if (d.hasOwnProperty('id')) {
                this.setState({
                  reshared: true,
                  reshared_count: ++this.state.reshared_count,
                });
              } else {
                AlertIOS.alert('转播失败', '似乎转播失败了', [{
                  text: '重试',
                  onPress: self._reshare.bind(self, id)
                },
                  {
                    text: '好吧',
                    onPress: () => console.log('')
                  }]);
              }
            })
            .done()
      }]);


    } else {

      // 取消转播
      AlertIOS.alert('取消转播', '之前转播过此条广播，是否取消转播/删除它？', [{
        text: '不删除',
        onPress: () => console.log('')
      }, {
        text: '取消转播',
        onPress: () => fetch(Config.API_URL + 'shuo/v2/statuses/' + reshare_id.toString(), {
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer ' + this.props.token,
            }
          })
            .then((response) => response.json())
            .then(d => {
              console.log(d);

              this.setState({
                reshared: false,
                reshared_count: --this.state.reshared_count,
              });
            })
            .done()
      }]);


    }
  },

  render: function() {

    var o = this.props.data;

    return (
      <View style = {{flexDirection: 'row'}} >
        <TouchableHighlight style={{flex: 1,}} underlayColor='white' onPress={this._like.bind(this, o.id)}>
        <Text style = {{ flex: 1, color: this.state.liked ? '#02b875' : '#000', paddingTop: 10}}>
        赞 {this.state.like_count}</Text>
        </TouchableHighlight>
        <Text style = {{ flex: 1, color: '#000', paddingTop: 10}}>
        评论 {o.comments_count}</Text>
        <TouchableHighlight style={{flex: 1,}} underlayColor='#fff' 
        onPress={this._reshare.bind(this, o.id, o.reshare_id)}>
        <Text style = {{ flex: 1, color: this.state.reshared ? '#02b875' : '#000', paddingTop: 10}}>
        转播 {this.state.reshared_count}</Text>
        </TouchableHighlight>
      </View>
    );
  },

});

module.exports = Interaction;