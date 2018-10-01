window.onload = function () {
  const DanmakuPlayer = AwesomeDanmaku.DanmakuPlayer.getInstanceControl({
    el: '#app',
    nodeClass: 'danmaku-item',
    nodeMaxCount: 50,
    rollingTime: 6000,
    trackCount: 12,
    trackHeight: 60,
    nodeValueKey: 'text',
  })

  DanmakuPlayer.play()
  const fontFamilyList = ['Microsoft YaHei', 'PingFang SC', 'Consolas', 'Heiti SC', 'SimHei']
  let color = () => {
    return '#' + [
      (Math.floor(Math.random() * 155) + 100).toString(16),
      (Math.floor(Math.random() * 155) + 100).toString(16),
      (Math.floor(Math.random() * 155) + 100).toString(16),
    ].join('')
  }
  let fontSize = () => {
    return Math.floor(Math.random() * 26) + 18
  }
  let fontFamily = () => {
    return fontFamilyList[Math.floor(Math.random() * fontFamilyList.length)]
  }

  const list = []
  for (let i = 0; i < 1000; i++) {
    list.push({
      text: `这是第${i + 1}弹幕！！`,
      color: color(),
      fontSize: fontSize(),
      fontFamily: fontFamily()
    })
  }
  DanmakuPlayer.insertDanmaku(list)
}
