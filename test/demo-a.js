import Danmaku from '../src'
import { handleDrag } from "./slider/slider";

const DanmakuPlayA = Danmaku.control.getPlayer({
  el: '#demo-a',
  nodeClass: 'item',
  rollingTime: 5000
})

DanmakuPlayA.play()

const options = {
  speed: 1,
  opacity: 1,
}

let i = 0
setInterval(() => {
  DanmakuPlayA.insert(Object.assign({
    value: `这是第${++i}弹幕！！`,
    fontWeight: 'bolder'
  }, options))
}, 60)


handleDrag('.slider-box', '.density .slider-button', (val) => {

})

/**
 * Speed
 */
const speedBtn = document.querySelector('.speed .slider-button')
speedBtn.style.left = `${options.speed / 2 * 100}px`

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
opacityBtn.style.left = `${(Number((options.opacity * 0.6).toFixed(2)) + 0.4) * 100}px`
opacityRText.innerText = `${(Number((options.opacity * 0.6).toFixed(2)) + 0.4) * 100}%`

handleDrag('.slider-box', '.opacity .slider-button', {
  move: (val) => {
    const pro = Number((val * 0.6).toFixed(2)) + 0.4
    opacityRText.innerText = `${parseInt(val * 100) || 0}%`
    options.opacity = pro
    DanmakuPlayA.change('opacity', pro)
  }
})
