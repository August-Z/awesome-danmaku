# awesome-danmaku
[![npm version](https://img.shields.io/npm/v/awesome-danmaku.svg?style=flat-square)](https://www.npmjs.org/package/awesome-danmaku)
[![npm downloads](https://img.shields.io/npm/dm/awesome-danmaku.svg?style=flat-square)](https://www.npmjs.com/package/awesome-danmaku)


## awesome-danmaku 是什么
awesome-danmaku 是一款解决前端弹幕场景需求的插件。它基于原生 JS 实现的，不依赖任何框架。


## 下载
```bash
$ npm install awesome-danmaku
```

## 使用

最简易的起步
```html
<div id="app"></div>
```
```js
import Danmaku from 'awesome-danmaku'
const player = Danmaku.control.getPlayer('#app')

// play 和 insert 这两个主要操作没有先后次序的要求，你亦可以先插入后再启动控制器
danmakuPlayer.play()
danmakuPlayer.insert([
  'Hello Awesome Danmaku!',
  '我是第1条弹幕...',
  '我是第2条弹幕...',
  '我是第3条弹幕...',
])  
```

## API 

### Control
##### getPlayer(selectors | HTMLElement | config): Player
```js
// 获取弹幕机 Player
Control.getPlayer('#app')

// 传入更详细的配置，这里增加了「弹幕最大数」与「弹幕轨道数」的参数
Control.getPlayer({
  el: '#app',
  maxCount: 50,
  trackCount: 5
})
```

### Player
##### play()
```js 
// 启动弹幕机
Player.play()
```

##### pause()
```js
// 暂停弹幕机，重启可直接使用 play()
Player.pause()
```

##### stop()
```js
// 关闭弹幕机，清空弹幕发送队列与数据
Player.stop()
```

##### insert(string | config [, sync])
```js
// 将弹幕内容置入弹幕机
// sync 默认为 false，该条弹幕会进入弹幕发送队列
Player.insert('Hello Awesome-Danmaku!')

// sync 为 true 时，该条弹幕将立即显示(插队)
Player.insert({
  value: 'Hello Awesome-Danmaku!',
  opacity: 0.8,
  color: '#ff0000',
})

// 参数可以以数组方式传递
Player.insert([
  '这是一条普通的弹幕',
  {
    value: '这是一条有点黄的弹幕',
    color: '#ffff00'
  }
])
//
```


## 配置

##### 弹幕机 - Player Config
```js
// 下方值除 el 外均为该属性的默认值
const PlayerConfig = {
 
  // 弹幕机创建所需要的 DOM 节点，可以传递字符串选择器或者是具体的 DOM 对象
  el: '#app',
  
  // 每条弹幕运动的总时长，单位为毫秒
  rollingTime: 6000,
  
  // 弹幕节点的 DOM 标签，大小写不敏感
  nodeTag: 'p',
  
  // 弹幕节点的类名，可通过这里修改弹幕的样式
  nodeClass: 'awesome-danmaku-item',
  
  // 弹幕节点的最大值，该值设置过大可能会影响运行性能
  nodeMaxCount: 25,
  
  // 传入弹幕机的节点文本key，通常不设为空，为空时默认为'text'
  nodeValueKey: 'value',
  
  // 弹幕机轨道数
  trackCount: 5,
  
  // 弹幕机轨道高度，单位为 px
  trackHeight: 40,
  
  // 弹幕机的节点列表，可传入弹幕节点
  list: [] 
}
```
##### 弹幕节点 - Node Config 
```js
const nodeConfig = {
  // 弹幕文本，该枚举 key 可根据弹幕机 nodeValueKey 调整
  text: '',
  
  // 弹幕字体大小，为数字时单位为px，其他单位可通过字符串传递
  fontSize: 22,
  
  // 弹幕字体
  fontFamily: 'SimHei',
  
  // 弹幕字重
  fontWeight: 'normal',
  
  // 不透明度
  opacity: 1,
  
  // 弹幕字体颜色
  color: '#FFFFFF',
  
  // 弹幕速度系数，取值范围(>0)，标准为1
  speed: 1
}
```

## 版本更新

### v1.3.1
player#insert(string | config [, sync])  
现在使用 insert() 插入弹幕时，可添加第二个参数，将发送弹幕立即显示

### v1.3.0
使用 window.requestAnimationFrame 代替了原有的队列定时器逻辑

