import { DanmakuRunStatus, IDanmaku } from "../../interface/danmaku/IDanmaku"
import { ITrack } from "../../interface/track/ITrack"
import { IPlayer } from "../../interface/player/IPlayer"

/**
 * 弹幕节点
 */
export class Danmaku implements IDanmaku {

  public readonly player: IPlayer
  public track?: ITrack
  public text: string = ''
  public speed: number = 0
  public launchTime: number = 0
  public totalTime: number = 0
  public translateX: number = 0
  public dom?: HTMLElement
  public runStatus: DanmakuRunStatus = DanmakuRunStatus.EMPTY
  protected options: DanmakuOptions

  /**
   * 创建一个弹幕节点
   * @param ops {DanmakuOptions& IPlayer} 弹幕设置项
   */
  constructor (ops: DanmakuOptions & { player: IPlayer }) {
    this.options = ops
    this.player = ops.player
  }

  /**
   * 初始化
   * @param el 挂载的 HTML 元素
   */
  public init (el: HTMLElement): Danmaku {
    this.dom = el
    this.runStatus = DanmakuRunStatus.INIT
    return this
  }

  /**
   * 弹幕发射, 进入运动状态
   */
  public launch (): Danmaku {
    if (this.dom instanceof HTMLElement) {
      this.dom.style.transform = `translate3d(${this.translateX}px, 0, 0)`
    }
    return this
  }

  /**
   * 弹幕运动完毕, 隐藏并重归起始点
   */
  public flyBack (): Danmaku {
    if (this.dom instanceof HTMLElement) {
      this.dom.textContent = ''
      this.dom.style.display = 'none'
      this.dom.style.transform = `translate3d(0, 0, 0)`
      this.dom.style.transition = `transform 0ms linear 0s`
    }
    return this
  }

  /**
   * 弹幕是否准备就绪, 可供运动发射操作
   */
  public get unObstructed (): boolean {
    return this.runStatus === DanmakuRunStatus.INIT
      || this.runStatus === DanmakuRunStatus.RUN_END
  }

  public patch (): Danmaku {
    this.computedTextSize()
    this.computedTotalDistance()
    this.joinTrack()
    this.editText()
    return this
  }

  private computedTextSize (): void {
    // todo
  }

  private computedTotalDistance (): void {
    // todo
  }

  private joinTrack (): Danmaku {
    return this
  }

  private editText (): Danmaku {
    if (this.dom instanceof HTMLElement) {
      this.dom.textContent = this.text
    }
    return this
  }

  /**
   * 绘制样式
   * @param style
   */
  private draw (style: CSSStyleDeclaration): Danmaku {
    if (this.dom instanceof HTMLElement) {
      const styleSetter: CSSStyleDeclaration = this.dom.style
      for (const k in style) {
        if (style.hasOwnProperty(k) && styleSetter.hasOwnProperty(k)) {
          styleSetter[k] = style[k]
        }
      }
    } else {
      throw new Error('Draw error: dom not instanceof HTMLElement !')
    }
    return this
  }

}
