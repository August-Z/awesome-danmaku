import Danmaku from '../src'
import { handleDrag } from "./slider/slider";
import Stats from 'stats.js/build/stats.min';

// var stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);
//
// function animate () {
//
//   stats.begin();
//
//   // monitored code goes here
//
//   stats.end();
//
//   requestAnimationFrame(animate);
//
// }
//
// requestAnimationFrame(animate);

window.DanmakuPlayA = Danmaku.getPlayer({
  el: '#demo-a',
  nodeClass: 'item',
  rollingTime: 10000,
  nodeMaxCount: 500,
  trackCount: 30,
  trackHeight: 20
})

DanmakuPlayA.play()
DanmakuPlayA.change('overlap', 1)

const options = {
  density: 0.5,
  speed: 1,
  opacity: 1,
}

const danmakuList = [
  '第一',
  '我才是第一！',
  'Hello world!!',
  '如你所见，这个主站似乎被小A荒废了',
  '什么时候写主站???',
  '这些弹幕到底是谁发的？',
  'Move fast and break things !',
  '我来翻译一下这句 facebook 的名言：行动迅速、破除陈规！',
  '来自 Awesome-Danmaku ...',
  '是不是应该加一点背景图之类的？',
  '前排吃瓜群众',
  '这种简陋的性冷淡风到底是什么情况...',
  '弹幕君已死..有事烧纸...'
]
setInterval(() => {
  DanmakuPlayA.insert(Object.assign({
    value: danmakuList[Math.floor(Math.random() * danmakuList.length)],
    fontWeight: 'bolder',
    fontSize: 10 + Math.floor(Math.random() * 5),
    color: getColor()
  }, options))
}, 10)


/**
 * Density
 */
const densityBtn = document.querySelector('.density .slider-button')
densityBtn.style.left = `${ options.density * 100 }px`

handleDrag('.slider-box', '.density .slider-button', {
  up: (val) => {
    const pro = Number((val / 100).toFixed(2))
    DanmakuPlayA.change('overlap', pro)
  }
})

/**
 * Speed
 */
const speedBtn = document.querySelector('.speed .slider-button')
speedBtn.style.left = `${ options.speed / 2 * 100 }px`

handleDrag('.slider-box', '.speed .slider-button', {
  move: (val) => {
    const pro = val < 0.5
      ? val + 0.5
      : val * 2
    options.speed = pro
    DanmakuPlayA.change('speed', pro)
  }
})

/**
 * Opacity
 */
const opacityBtn = document.querySelector('.opacity .slider-button')
const opacityRText = document.querySelector('.opacity .slider-right-text')
opacityBtn.style.left = `${ (Number((options.opacity * 0.6).toFixed(2)) + 0.4) * 100 }px`
opacityRText.innerText = `${ (Number((options.opacity * 0.6).toFixed(2)) + 0.4) * 100 }%`

handleDrag('.slider-box', '.opacity .slider-button', {
  move: (val) => {
    const pro = Number((val * 0.6).toFixed(2)) + 0.4
    opacityRText.innerText = `${ parseInt(val * 100) || 0 }%`
    options.opacity = pro
    DanmakuPlayA.change('opacity', pro)
  }
})


function getColor () {
  return '#' + [
    (Math.floor(Math.random() * 155) + 100).toString(16),
    (Math.floor(Math.random() * 155) + 100).toString(16),
    (Math.floor(Math.random() * 155) + 100).toString(16),
  ].join('')
}
