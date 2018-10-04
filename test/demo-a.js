const Control = AwesomeDanmaku.control
const DanmakuPlayA = Control.getPlayer({
  el: '#demo-a',
  rollingTime: 3000
})

DanmakuPlayA.play()
for (let i = 0; i < 5; i++) {
  DanmakuPlayA.insert({
    value: `这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！这是第${i + 1}弹幕！！`,
    fontWeight: 'bolder'
  })
}
