# awesome-danmaku
[![npm](https://img.shields.io/npm/v/awesome-danmaku.svg?style=flat-square)](https://www.npmjs.com/package/awesome-danmaku)


## awesome-danmaku 是什么
awesome-danmaku 是一款重点前端各种弹幕场景需求的插件。它基于原生 JS 实现的，不依赖任何框架。


## 下载
```bash
$ npm install awesome-danmaku
```


## 使用

最简易的起步

```js
// use CommonJS
const DanmakuControl = require('awesome-danmaku').control

const danmakuPlayer = DanmakuControl.getPlayer('#app')


// use ES module
import Danmaku from 'awesome-danmaku'

const danmakuPlayer = Danmaku.control.getPlayer('#app')


// 调用 play 即可开始不断发送弹幕，insert 可以插入弹幕
// 这两个主要动作没有先后次序的要求，你亦可以先插入后再启动控制器
danmakuPlayer.play()
  .insert('Hello')
  .insert('Awesome Danmaku !')
  
danmakuPlayer.insert({
  value: 'I feel good.'
})

// 暂停运行
danmakuPlayer.pause()

// 清空当前已插入的弹幕列表
danmakuPlayer.clearList()
  
```

使用一些配置项

```js
const danmakuPlayer = DanmakuControl.getPlayer({
  el: '#demo-b',
  rollingTime: 3000,
  nodeTag: 'div',
  nodeClass: 'demo-b-item',
  nodeMaxCount: 10,
  nodeValueKey: 'text',
  trackList: 7,
  trackHeight: 70,
  on: {
    play () {
      console.log('Demo-b Start playing ！！')
    }
  }
})

danmakuPlayer.insert({
  text: 'used some config'
})

```


## 配置

TODO 编写中...
