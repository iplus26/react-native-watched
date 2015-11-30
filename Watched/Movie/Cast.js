'use strict';

var React = require('react-native');

var {AlertIOS,
  View,
  ScrollView,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet, } = React;

var Tool = require('./../lib/Tool');

var Cast = React.createClass({

  _openURL: function(alt) {

    // TODO: 点击时候的特效

    Tool.openURL(alt ? alt : null, function() {
      AlertIOS.alert(
        '打开页面失败',
        '豆瓣没有这个影人的页面，不过我可以试着在 IMDb 找找看',
        [
          {
            text: '试试 IMDb',
            onPress: () => console.log('Foo Pressed!')
          },
          {
            text: '好吧',
            onPress: () => console.log('Bar Pressed!')
          },
        ]
      );
    });
  },

  render: function() {

    var self = this;
    var movie = this.props.movie;

    return (

      // jshint ignore: start
      <View style={styles.block}>

          <Text style = {styles.title}>
            领衔主演
          </Text>

          <ScrollView horizontal = {true} 
              style={{
                flexDirection: 'row', 
                borderBottomWidth: 1,
                borderColor: '#E3E3E5',
              }}>
          { movie.casts.map(function(c) {
              return (
                <View>

                <TouchableHighlight onPress = { self._openURL.bind(null, c.alt) }>

                <Image style={{width: 100, height: 143, }} 
                  source={{ uri: (c.avatars && c.avatars.large) ? c.avatars.large : null }} />
                </TouchableHighlight>

                <Text style = {{paddingTop: 5, paddingBottom: 5, width: 98, textAlign: 'center', }} numberOfLine = {2}>
                  {c.name ? c.name : ''}
                </Text>
                </View>
                )
            }) }
          </ScrollView>

          <View style={{flexDirection: 'row', alignItems: 'center',}}>
          <Text style = {styles.title} >
            导演 
          </Text>

          {  

              movie.directors.map(function(d){
                return (
                  <TouchableHighlight 
                  onPress={ self._openURL.bind(null, d.alt)}>
                    <Text style={{margin: 10, marginLeft: 0, }}>{d.name ? d.name : ''}</Text>
                   </TouchableHighlight>
                  )
                })

          }

          </View>


        </View>
      // jshint ignore: end
      );
  }

});

var styles = StyleSheet.create({
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
});

module.exports = Cast;