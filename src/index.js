import { DanmakuPlayer } from './core/control'

module.exports = DanmakuPlayer

export default DanmakuPlayer

if (window && window['AwesomeDanmaku'] === undefined) {
  window.AwesomeDanmaku = DanmakuPlayer
}
