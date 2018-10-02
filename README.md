# awesome-danmaku
[![npm](https://img.shields.io/npm/v/awesome-danmaku.svg?style=flat-square)](https://www.npmjs.com/package/awesome-danmaku)


## awesome-danmaku 是什么
awesome-danmaku 是一款重点前端各种弹幕场景需求的插件。它基于原生 JS 实现的，不依赖任何框架。


## 下载
```bash
$ npm install awesome-danmaku
```


## 使用

创建弹幕控制器

```js
const danmaku = require('awesome-danmaku')
const DanmakuPlayer = danmaku.control.getInstanceControl({
  el: '#app',
  nodeClass: 'danmaku-item',
  nodeMaxCount: 25,
  rollingTime: 6000,
  trackCount: 10,
  trackHeight: 60,
  nodeValueKey: 'text',
})
```
