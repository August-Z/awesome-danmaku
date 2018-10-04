import { control } from '../src/index'

const DanmakuPlayer = control
const otherDanmakuPlayer = new DanmakuPlayer({
  el: '#demo-b',
  rollingTime: 2000,
  nodeTag: 'div',
  nodeClass: 'demo-b-item',
  nodeMaxCount: 10,
  nodeValueKey: 'text',
  trackList: 7,
  trackHeight: 70,
  on: {
    play () {
      console.warn('Demo-b Start playing ！！')
    }
  }
})

const fontFamilyList = ['Microsoft YaHei', 'PingFang SC', 'Consolas', 'Heiti SC', 'SimHei']

const b_list = []
for (let i = 0; i < 1000; i++) {
  b_list.push({
    text: `这是第${i + 1}弹幕！！`,
    color: getColor(),
    fontSize: getFontSize(),
    fontFamily: getFontFamily(),
    speed: getSpeed(),
  })
}

otherDanmakuPlayer.play().insert(b_list)


function getColor () {
  return '#' + [
    (Math.floor(Math.random() * 155) + 100).toString(16),
    (Math.floor(Math.random() * 155) + 100).toString(16),
    (Math.floor(Math.random() * 155) + 100).toString(16),
  ].join('')
}

function getFontSize () {
  return Math.floor(Math.random() * 26) + 18
}

function getFontFamily () {
  return fontFamilyList[Math.floor(Math.random() * fontFamilyList.length)]
}

function getSpeed () {
  return 0.5 + Math.random()
}
