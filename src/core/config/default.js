export class DnodeDefaultConfig {
  static FONT_SIZE: number = 22
  static FONT_FAMILY: string = 'SimHei'
  static COLOR: string = '#FFFFFF'
  static SPEED: number = 1.0

  static get getDefault (): Object {
    return {
      fontSize: DnodeDefaultConfig.FONT_SIZE,
      fontFamily: DnodeDefaultConfig.FONT_FAMILY,
      color: DnodeDefaultConfig.COLOR,
      speed: DnodeDefaultConfig.SPEED,
    }
  }
}

export class DanmakuPlayDefaultConfig {
  static ROLLING_TIME: number = 6000
  static NODE_TAG: string = 'p'
  static NODE_CLASS: string = 'awesome-danmaku-item'
  static NODE_MAX_COUNT: number = 25
  static NODE_VALUE_KEY: string = 'value'
  static TRACK_COUNT: number = 5
  static TRACK_HEIGHT: number = 40
  static EVENT: Object = {}

  static get getDefault (): Object {
    return {
      rollingTime: DanmakuPlayDefaultConfig.ROLLING_TIME,
      nodeTag: DanmakuPlayDefaultConfig.NODE_TAG,
      nodeClass: DanmakuPlayDefaultConfig.NODE_CLASS,
      nodeMaxCount: DanmakuPlayDefaultConfig.NODE_MAX_COUNT,
      nodeValueKey: DanmakuPlayDefaultConfig.NODE_VALUE_KEY,
      trackCount: DanmakuPlayDefaultConfig.TRACK_COUNT,
      trackHeight: DanmakuPlayDefaultConfig.TRACK_HEIGHT,
      on: DanmakuPlayDefaultConfig.EVENT
    }
  }
}

