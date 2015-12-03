/**
 *  Hi, I'm Ivan. 
 *  Watched for iOS is a tiny project helps me learn excellent React Native.
 *  The journey started on Oct 22th, 2015. 
 */

'use strict';

var React = require('react-native');
var {StyleSheet,
  Text,
  View,
  Navigator,
  NavigatorIOS, } = React;

// my own components
var SearchPage = require('./Movie/MovieSearch');
var UserProfilePage = require('./Views/ProfilePage');
var TimelinePage = require('./Post/Timeline');
var Config = require('./lib/Config');
var ComposeIcon = require('./Post/Compose/Compose');
var BackButton = require('./components/BackButton');

// wheels made by others
var Router = require('gb-native-router');
var {TabBarIOS, } = require('react-native-icons');

var TabBar = React.createClass({
  statics: {
    title: '<TabBarIOS>',
    description: 'Tab-based navigation. ',
  },

  displayName: 'HomeTabBar',

  getInitialState: function() {
    return {
      selectedTab: 'timelineTab',
      notifCount: 0,
      presses: 0,
    };
  },

  _addNavigator: function(firstRoute) {

    return (
      <Router headerStyle={{flex: 1, backgroundColor: '#fff', }}
              titleStyle={{color: '#000', }}
              statusBarColor='black'
              borderBottomWidth={1}
              borderColor='#D8D8D8'
              firstRoute={firstRoute} 
              backButtonComponent={BackButton}/>);
  },

  render: function() {

    return (
      // jshint ignore: start
      <TabBarIOS
            selectedTab={this.state.selectedTab}
            tintColor={Config.BASE_COLOR}
            barTintColor={'#fff'}>

        <TabBarIOS.Item 
            name='广播'
            iconName={'ion|ios-home-outline'}
            iconSize={32}
            title='广播'
            selectedIconName={'ion|ios-home'}
            selected={this.state.selectedTab === 'timelineTab'}
            onPress={() => {
              this.setState({ selectedTab: 'timelineTab', });
            }}>
               
            {this._addNavigator({
              name: '广播',
              component: TimelinePage, 
              rightCorner: ComposeIcon,
            })}
        
        </TabBarIOS.Item>

        <TabBarIOS.Item 
            name='电影'
            iconName={'ion|ios-film-outline'}
            selectedIconName={'ion|ios-film'}
            title={'电影'}
            iconSize={32}
            selected={this.state.selectedTab === 'movie'}
            onPress={() => {
              this.setState({  selectedTab: 'movie', });
            }}>

              {this._addNavigator({
                  component: SearchPage, 
                  name: '电影',
                  rightCorner: require('./Movie/components/icons/Search'),
              })}

        </TabBarIOS.Item>
        
        <TabBarIOS.Item 
            name='我'
            title='我'
            iconSize={32}
            iconName={'ion|ios-person-outline'}
            selectedIconName={'ion|ios-person'}
            selected={this.state.selectedTab === 'meTab'}
            onPress={() => {
              this.setState({ selectedTab: 'meTab', });
            }}>
               
            {this._addNavigator({
              component: require('./Views/ProfilePage'), 
              name: '我'
            })}
        
        </TabBarIOS.Item>
          
      </TabBarIOS>

      // jshint ignore: end

      );
  },

});

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#414A8C',
  },
  tabText: {
    color: 'white',
    marginTop: 70
  },
});

React.AppRegistry.registerComponent('Watched', () => TabBar);