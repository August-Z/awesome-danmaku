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
const DanmakuControl = require('awesome-danmaku').control

const danmakuPlayer = DanmakuControl.getPlayer('#app')

danmakuPlayer.play()
  .insert('Hello')
  .insert('Awesome Danmaku !')
  
danmakuPlayer.insert({
  value: 'I feel good.'
})
  
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
