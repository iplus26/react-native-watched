# Sketch
成品未出，repo 先行。

这是我学习 [React Native](https://github.com/facebook/react-native) 的实练项目，豆瓣客户端（广播 + 电影）。

![Sketch](https://github.com/iplus26/react-native-watched/raw/master/Sketch.gif)

# Install

To run Watched on your own device, you should follow the steps:

0. You should have a Mac with Xcode 7.0 or later (RN required) installed. 
1. Watched is built with [React Native](https://github.com/facebook/react-native), therefore, you need RN installed. Follow the official [Get Started](http://facebook.github.io/react-native/docs/getting-started.html#content) page.
2. Clone the repo and go to `Watched` folder. 
3. Run `npm install react-native@^0.14.2` and then `npm install`, to keep `node_modules` folder ordered. 
4. Click 'Run' in Xcode. 

# Notes

因为[豆瓣广播的 API docs](http://developers.douban.com/wiki/?title=shuo_v2) 还是存在比较多的问题，所以我根据自己的开发过程整理一下。

1. attachments

广播对象中的 attachments 的属性在文档中含糊不清，不过文档中指明目前来说 attachments 只能支持一个对象（虽然它是一个数组）。我们可以通过 attachments[0].type 这个属性值来判断一部分 attachments 的类型。

	- `rec` 目前来说这个是“推荐网址”（对应的 post.title），因此 media[0] 如果存在的话应该是网站的相关图片
	- `image` 如果 type 是 image 的话，则是用户发出的广播。**虽然是 type: image 但也可能这条广播不带图**
	- `song` 推荐单曲
	- `music` 
	- `movie` 用户标记了电影，这个电影的 id 是需要通过 attachments[0].expaned_href (完整地址) 去 match 的
	- `book`
    - `movie`
    - `` (空)
    - `com.douban.group`
    - `com.douban.book`
    - `com.douban.people`
    - `url`
    - `event`
    - `photos` 上传到相册
    - `com.douban.site` 推荐日记

# log

The kid was born on Oct 22th, 2015 and I didn't keep the growing up diaries in the next month. Check out [commit history](https://github.com/iplus26/react-native-watched/commits/master) and find what's new after Dec 2, 2015. 