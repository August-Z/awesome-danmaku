import { DanmakuPlayer } from './core/control'

module.exports = {
  control: DanmakuPlayer
}

export default {
  control: DanmakuPlayer
}

if (window && window['AwesomeDanmaku'] === undefined) {
  window.AwesomeDanmaku = {
    control: DanmakuPlayer
  }
}
