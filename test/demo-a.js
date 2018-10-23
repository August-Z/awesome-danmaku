import Danmaku from '../src'

const DanmakuPlayA = Danmaku.control.getPlayer({
  el: '#demo-a',
  rollingTime: 8000
})

DanmakuPlayA.play()

for (let i = 0; i < 50; i++) {
  DanmakuPlayA.insert({
    // value: `这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！`,
    value: `这是第${i + 1}弹幕！！`,
    fontWeight: 'bolder'
  })
}

setTimeout(() => {
  DanmakuPlayA.pause()

  setTimeout(() => {
    DanmakuPlayA.play()
  }, 3000)

}, 3000)


console.log(DanmakuPlayA)

