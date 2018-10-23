import 'babel-polyfill'
import { DanmakuPlayer } from '../core/control/index'

if (window && window['AwesomeDanmaku'] === undefined) {
  window.AwesomeDanmaku = {
    control: DanmakuPlayer
  }
}
