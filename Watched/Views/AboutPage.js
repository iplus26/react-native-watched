var React = require('react-native');
var {StyleSheet, LinkingIOS, TouchableHighlight, Image, Dimensions, View, ScrollView, Text, Component} = React;

var AboutPage = React.createClass({
    render: function() {
        return (
            // jshint ignore: start
            <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Image
                 style={styles.image}
                 source={{uri: base64Images['me'], scale: 3}}
                /> 
                <Text style={styles.text}>
                    { '你好，我是 Ivan'}
                </Text>

                <Text style={styles.text}>
                    { 'Watched 是我给你的礼物' }
                </Text>

                <Image 
                 style={styles.icon}
                 source={{uri: base64Images.QuillWithLink, scale: 3}}
                 />

                 <Text style={styles.text}>
                    {'写封信是不会怀孕的' }
                 </Text>
                 
                 <TouchableHighlight 
                    style={styles.button} 
                    onPress={this._emailMe}
                    underlayColor='#414A8C'>
                   <Text style={[styles.text, styles.serif]}>me@ivanjiang.com</Text>
                 </TouchableHighlight>
                 
                 <Image 
                 style={styles.icon}
                 source={{uri: base64Images.Dragon, scale: 3}}
                 />
                 <Text style={styles.text}>
                    { '去 App Store 给个好评\n' + '(热切期望脸' }
                 </Text>

                 <TouchableHighlight 
                    style={styles.button} 
                    onPress={this._linkToAppStore}
                    underlayColor='#414A8C'>
                   <Text style={[styles.text, styles.serif]}>Go</Text>
                 </TouchableHighlight>

                 <Text 
                 style={[styles.text, styles.serif, {color: '#597EA7'}]}>
                 You're like a beautiful, deep, still lake in the middle of a concrete world.
                 </Text>
            </View>
            </ScrollView>

            // jshint igonre: end
            );
    },

    _emailMe: function() {
        console.log('Writing an e-mail... ');
        LinkingIOS.openURL('mailto:me@ivanjiang.com');
    },

    _linkToAppStore: function() {
        LinkingIOS.openURL('http://itunes.apple.com/app/id378458261');
    }
});

var littleMargin = Dimensions.get('window').width * .1;

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#414A8C',
    },
    content: {
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        color: '#84D8D0',
        marginBottom: littleMargin,
    // backgroundColor: 'yellow',
    },
    serif: {
        fontFamily: 'Times',
        padding: littleMargin / 2,
        fontStyle: 'italic',
    },
    image: {
        width: littleMargin * 2,
        height: littleMargin * 2,
        borderRadius: littleMargin,
        margin: littleMargin,
        marginTop: littleMargin * 2,
    },
    icon: {
        width: littleMargin,
        height: littleMargin,
        marginBottom: littleMargin,
    },
    button: {
        marginTop: -littleMargin,
    }
});

var base64Images = require('./lib/Icon');

module.exports = AboutPage;