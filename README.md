# Sketch
成品未出，repo 先行。

这是我学习 [React Native](https://github.com/facebook/react-native) 的实练项目，豆瓣客户端（广播 + 电影）。

![Sketch](https://github.com/iplus26/react-native-watched/raw/master/Sketch.gif)

# log

**Dec 2, 2015**

* 用户页面初稿
* 点击用户头像进入用户页面，将 PostTimelineListView 拓展成为关注的时间流 + 某个用户的时间流
* 将原来的登录用户的个人页面拓展为某个用户的页面

**...**

**Nov 13, 2015** 

* 把 React Native 升级到 0.14.2 版本
* 之前实现的功能有
	* 豆瓣电影的搜索、详情页
	* 豆瓣广播 timeline 显示和赞
* 仍然存在的问题
	* 行距很小，设置 `lineHeight` 属性的话字是下对齐的，没法儿居中
	* ScrollView 有迷の间距