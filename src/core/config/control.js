// @flow
export class DanmakuControlPlayStatus {
  static EMPTY: number = -1
  static INIT: number = 100
  static STOP: number = 110
  static PLAY: number = 200
  static PAUSED: number = 210
}

export const DanmakuControlEventName = {
  INIT: 'init',
  PLAY: 'play',
  PAUSE: 'pause',
  STOP: 'stop'
}
