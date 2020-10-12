import Danmaku from '../src'
import Stats from 'stats.js/build/stats.min';

window.DanmakuPlayA = Danmaku.getPlayer({
  el: '#danmaku',
  nodeClass: 'item',
  rollingTime: 6500,
  nodeMaxCount: 150,
  trackCount: 30,
  trackHeight: 25
})

DanmakuPlayA.play()
DanmakuPlayA.change('overlap', 1)

const options = {
  density: 3,
  speed: 1,
  opacity: 1,
}

const danmakuList = [
  '夏日是调整心情的最好季节尤其是黄昏与晚风。',
  '去做你想做的事情 哪怕不值得 哪怕真的是浪费。',
  '如果能在十一月的傍晚时，匆匆吃掉一碗饭后换上喜欢的卫衣，随后去见一个喜欢的人，和他一起走在安静的巷子里，或是热闹的夜市里，那时候一定连晚风都是无比温柔的。',
  '不管生活怎么亏待我，我都要大口大口的活着',
  '夏日的遗憾一定 会被秋风温柔化解',
  '现在的男孩子都好有品位啊 一个个都看不上我',
  '好像怎么都快乐不起来了毕竟我失去了火锅烧烤麻将扑克烤肉煎饼和你',
  'Hello world!!',
  'public static void main',
  '如你所见，这个主站似乎被小A荒废了',
  '什么时候写主站???',
  '这些弹幕到底是谁发的？',
  'Move fast and break things !',
  '来自 Awesome-Danmaku ...',
  '是不是应该加一点背景图之类的？',
  '前排吃瓜群众',
  '这种简陋的性冷淡风到底是什么情况...',
  '弹幕君已死..有事烧纸...'
]


/**
 * Density
 */
// const densityBtn = document.querySelector('.density .slider-button')
// densityBtn.style.left = `${ options.density * 100 }px`
//
// handleDrag('.slider-box', '.density .slider-button', {
//   up: (val) => {
//     const pro = Number((val / 100).toFixed(2))
//     DanmakuPlayA.change('overlap', pro)
//   }
// })

/**
 * Speed
 */
// const speedBtn = document.querySelector('.speed .slider-button')
// speedBtn.style.left = `${ options.speed / 2 * 100 }px`
//
// handleDrag('.slider-box', '.speed .slider-button', {
//   move: (val) => {
//     const pro = val < 0.5
//       ? val + 0.5
//       : val * 2
//     options.speed = pro
//     DanmakuPlayA.change('speed', pro)
//   }
// })

/**
 * Opacity
 */
// const opacityBtn = document.querySelector('.opacity .slider-button')
// const opacityRText = document.querySelector('.opacity .slider-right-text')
// opacityBtn.style.left = `${ (Number((options.opacity * 0.6).toFixed(2)) + 0.4) * 100 }px`
// opacityRText.innerText = `${ (Number((options.opacity * 0.6).toFixed(2)) + 0.4) * 100 }%`
//
// handleDrag('.slider-box', '.opacity .slider-button', {
//   move: (val) => {
//     const pro = Number((val * 0.6).toFixed(2)) + 0.4
//     opacityRText.innerText = `${ parseInt(val * 100) || 0 }%`
//     options.opacity = pro
//     DanmakuPlayA.change('opacity', pro)
//   }
// })


function getColor () {
  return '#' + [
    (Math.floor(Math.random() * 155) + 100).toString(16),
    (Math.floor(Math.random() * 155) + 100).toString(16),
    (Math.floor(Math.random() * 155) + 100).toString(16),
  ].join('')
}

function addDanmaku () {
  DanmakuPlayA.insert(Object.assign({
    value: danmakuList[Math.floor(Math.random() * danmakuList.length)],
    fontWeight: 'bolder',
    fontSize: 10 + Math.floor(Math.random() * 5),
    color: getColor()
  }, options))
}

let i = 0
const list = []
while (i < 50000) {
  list[i] = Object.assign({
    value: danmakuList[Math.floor(Math.random() * danmakuList.length)],
    fontWeight: 'bolder',
    fontSize: 10 + Math.floor(Math.random() * 5),
    color: getColor()
  }, options)
  i++
}
DanmakuPlayA.insert(list)

// STATS>JS
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function animate () {
  stats.begin();
  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
