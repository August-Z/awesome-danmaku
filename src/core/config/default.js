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

