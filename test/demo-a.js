const Control = AwesomeDanmaku.control
const DanmakuPlayA = Control.getPlayer('#demo-a')

const list = []
for (let i = 0; i < 100; i++) {
  if (i < 50) {
    list.push(`这是第${i + 1}弹幕！！`)
  } else if (i === 50) {
    DanmakuPlayA.play().insert(list)
  } else {
    DanmakuPlayA.insert(`这是第${i + 1}弹幕！！`)
  }
}

