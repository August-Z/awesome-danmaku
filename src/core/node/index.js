// @flow
import * as __CONFIG__ from "../config"
import { translateTextToSize } from "../util/text-size";
import { Dtrack } from "../track";
import { DanmakuPlayer } from "../control";
import { DnodeRunStatus } from "../config/node";

export class Dnode {
  control: DanmakuPlayer
  track: Dtrack
  text: string
  width: number
  height: number
  fontSize: number | string
  fontFamily: string
  fontWeight: number | string
  opacity: number | string
  color: string
  speed: number
  translateX: number
  launchTime: number
  totalTime: number
  dom: HTMLElement
  runStatus: number

  static instanceTextSizeDom: HTMLElement

  constructor (ops: DnodeOptions) {
    this.runStatus = DnodeRunStatus.EMPTY
    this._init(ops)
  }

  get unObstructed (): boolean {
    return [
      DnodeRunStatus.INIT,
      DnodeRunStatus.RUN_END
    ].includes(this.runStatus)
  }

  get drawStyle (): { [key: string]: string | number } {
    return {
      display: 'inline-block',
      width: `${this.width}px`,
      height: `${this.height}px`,
      lineHeight: '1.125',
      fontSize: `${this.fontSize}px`,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
      color: this.color,
      top: `${this.track.getTopByMiddleDnode(this.height)}px`,
      left: `${this.control.playerWidth}px`,
      opacity: this.opacity + '',
      transform: `translate3d(0, 0, 0)`,
      transition: `transform ${this.totalTime}ms linear 0s`,
      position: 'absolute',
      userSelect: 'none',
      whiteSpace: 'pre',
      perspective: '500px',
      cursor: 'none',
      pointerEvents: 'none'
    }
  }

  /**
   * 用于计算弹幕节点尺寸的单例 DOM 模版
   * @param ops<DnodeTemplateDom>
   * @returns {HTMLElement}
   */
  static getInstanceTemplateDom (ops: DnodeTemplateDom = {
    fontSize: __CONFIG__.DnodeDefaultConfig.FONT_SIZE + 'px',
    fontFamily: __CONFIG__.DnodeDefaultConfig.FONT_FAMILY,
    fontWeight: __CONFIG__.DnodeDefaultConfig.FONT_WEIGHT,
  }): HTMLElement {
    if (!Dnode.instanceTextSizeDom) {

      // create template
      const template: HTMLElement = document.createElement('div')
      const templateStyle = {
        position: 'fixed',
        visibility: 'hidden',
        display: 'inline-block',
        zIndex: '-1',
        whiteSpace: 'pre',
        ...ops
      }
      template.className = 'awesome-danmaku-template'
      Object.entries(templateStyle).forEach(([k, v]: any): void => {
        template.style[k] = v
      })

      // insert dom to html
      if (document.body) {
        document.body.appendChild(template)
      } else if (DanmakuPlayer.getPlayer().el instanceof HTMLElement) {
        DanmakuPlayer.getPlayer().el.appendChild(template)
      } else {
        throw new Error('Template DOM Error! [document.body] missing or Not control wrap Dom!!')
      }
      Dnode.instanceTextSizeDom = template

    } else {
      // change style, and resize
      Object.entries(ops).forEach(([k, v]: any): void => {
        Dnode.instanceTextSizeDom.style[k] = v
      })
    }
    return Dnode.instanceTextSizeDom
  }

  init (el: HTMLElement): Dnode {
    this.dom = el
    this.runStatus = DnodeRunStatus.INIT
    return this
  }

  patch (ops: DnodeOptions): Dnode {
    this._init(ops)
    this._computedTextSize()
    this._computedTotalDistance()
    this._joinTrack()
    this._editText()
    return this
  }

  run (cb?: Function): void {
    this._draw()

    this.runStatus = DnodeRunStatus.READY
    this.track.rolling((t) => {
      // 发射弹幕，此处 Status => Running
      this.launch()
      this.runStatus = DnodeRunStatus.RUNNING

      // 经过了发射区域，弹幕文字已经全部显示于轨道中，此处 Status => Launched，该时间受轨道的允许覆盖率(0%-100%)影响
      setTimeout(() => {
        t.stopRolling()
        this.runStatus = DnodeRunStatus.LAUNCHED
      }, this.launchTime * this.track.overlap)

      // 弹幕经过了总运动时长，此时已到达轨道终点，此处 Status => RunEnd
      setTimeout(() => {
        this.flyBack()
        this.runStatus = DnodeRunStatus.RUN_END

        // callback
        typeof cb === 'function' && cb(this)
      }, this.totalTime)
    })
  }

  /**
   * Dnode 正式开始运动，发射
   */
  launch (): Dnode {
    this.dom.style.transform = `translate3d(${this.translateX}px, 0, 0)`
    return this
  }

  /**
   * Dnode 运动完毕，隐藏并归位
   */
  flyBack (): Dnode {
    this.dom.innerText = ''   // ?? 是否需要有待测试
    this.dom.style.display = `none`
    this.dom.style.transform = `translate3d(0, 0, 0)`
    this.dom.style.transition = `transform 0ms linear 0s`
    return this
  }

  _init (ops: DnodeOptions): void {
    if (ops instanceof Object) {
      this.text = ops.text
      this.control = ops.control
      this.fontSize = ops.fontSize
      this.fontFamily = ops.fontFamily
      this.fontWeight = ops.fontWeight
      this.opacity = ops.opacity
      this.color = ops.color
      this.speed = ops.speed
    } else {
      throw new Error('Init error: Dnode ops bad !')
    }
  }

  _computedTextSize (): void {
    const { width, height } = translateTextToSize(this.text, Dnode.getInstanceTemplateDom({
      fontSize: this.fontSize + 'px',
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
    }))
    this.width = width
    this.height = this.control.trackHeight || height
  }

  _computedTotalDistance (): void {
    const totalDis: number = this.control.playerWidth + this.width
    this.translateX = (-1) * totalDis
    this.launchTime = Math.round(this.control.rollingTime * (this.width / totalDis))
    this.totalTime = Math.round(this.control.rollingTime / this.speed)
  }

  /**
   * 节点进入轨道
   * @remark 此时弹幕已经 checked，尚未渲染
   * @returns {Dnode}
   */
  _joinTrack (): Dnode {
    this.track = this.control.getUnObstructedTrack()
    return this
  }

  _editText (): Dnode {
    this.dom.innerText = this.text
    return this
  }

  /**
   * 重绘样式
   * @returns {Dnode}
   */
  _draw (): Dnode {
    if (!(this.dom instanceof HTMLElement)) {
      throw new Error('Draw error: dom not instanceof HTMLElement !')
    }
    const style: CSSStyleDeclaration = this.dom.style
    Object.entries(this.drawStyle).forEach(([k, v]: any): void => {
      style[k] = v
    })
    return this
  }

}
