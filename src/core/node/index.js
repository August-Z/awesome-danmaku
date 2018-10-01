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
  color: string
  speed: number
  translateX: number
  launchTime: number
  dom: HTMLElement
  runStatus: number

  static instanceTextSizeDom: HTMLElement

  constructor (ops: string | DnodeOptions, control?: DanmakuPlayer = DanmakuPlayer.getInstanceControl()) {
    this.runStatus = DnodeRunStatus.EMPTY
    this._init(ops, control)
  }

  get unObstructed (): boolean {
    return [DnodeRunStatus.INIT, DnodeRunStatus.RUN_END].includes(this.runStatus)
  }

  /**
   * 用于计算弹幕节点尺寸的单例 DOM 模版
   * @param ops<DnodeTemplateDom>
   * @returns {HTMLElement}
   */
  static getInstanceTemplateDom (ops: DnodeTemplateDom = {
    fontSize: __CONFIG__.DnodeDefaultConfig.FONT_SIZE + 'px',
    fontFamily: __CONFIG__.DnodeDefaultConfig.FONT_FAMILY
  }): HTMLElement {
    if (!Dnode.instanceTextSizeDom) {
      const template: HTMLElement = document.createElement('span')
      template.style.position = 'absolute'
      template.style.visibility = 'hidden'
      template.style.display = 'inline-block'
      template.style.fontSize = ops.fontSize
      template.style.fontFamily = ops.fontFamily
      if (document.body) {
        document.body.appendChild(template)
      } else {
        throw new Error('Template DOM Error: document.body missing !!')
      }
      Dnode.instanceTextSizeDom = template
    } else {
      Dnode.instanceTextSizeDom.style.fontSize = ops.fontSize
      Dnode.instanceTextSizeDom.style.fontFamily = ops.fontFamily
    }
    return Dnode.instanceTextSizeDom
  }

  init (el: HTMLElement): Dnode {
    this.dom = el
    this.runStatus = DnodeRunStatus.INIT
    return this
  }

  patch (ops: string | DnodeOptions): Dnode {
    this._init(ops)
    this._computedTextSize()
    this._computedTotalDistance()
    this._joinTrack()
    this._editText()
    return this
  }

  run (): any {
    return new Promise((resolve, reject) => {
      this._draw()
      this.runStatus = DnodeRunStatus.READY
      try {
        this.track.rolling((t) => {
          this.launch()
          this.runStatus = DnodeRunStatus.RUNNING
          setTimeout(() => {
            t.stopRolling()
            this.runStatus = DnodeRunStatus.LAUNCHED
          }, this.launchTime)
          setTimeout(() => {
            this.flyBack()
            resolve(this)
          }, this.control.rollingTime)
        })
      } catch (e) {
        reject(e)
      } finally {
        // todo some hook?
      }
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

  _init (ops: string | DnodeOptions, control?: DanmakuPlayer = DanmakuPlayer.getInstanceControl()) {
    if (typeof ops === 'string') {
      this.text = ops
      this.control = control
      // todo extend control style
    } else if (ops instanceof Object) {
      this.text = ops.text
      this.control = ops.control
      this.fontSize = ops.fontSize
      this.fontFamily = ops.fontFamily
      this.color = ops.color
      this.speed = ops.speed
    } else {
      throw new Error('Dnode ops bad !')
    }
  }

  _computedTextSize (): void {
    const { width, height } = translateTextToSize(this.text, Dnode.getInstanceTemplateDom({
      fontSize: this.fontSize + 'px',
      fontFamily: this.fontFamily
    }))
    this.width = width
    this.height = height
  }

  _computedTotalDistance (): void {
    const totalDis: number = this.control.playerWidth + this.width
    this.translateX = (-1) * totalDis
    this.launchTime = Math.round(this.control.rollingTime * (this.width / totalDis))
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
    const patchStyle = {
      display: 'inline-block',
      width: `${this.width}px`,
      height: `${this.height}px`,
      lineHeight: '1.125',
      fontSize: `${this.fontSize}px`,
      fontFamily: this.fontFamily,
      color: this.color,
      top: `${this.track.getTopByMiddleDnode(this.height)}px`,
      left: `${this.control.playerWidth}px`,
      opacity: '1',
      transform: `translate3d(0, 0, 0)`,
      transition: `transform ${Math.round(this.control.rollingTime / this.speed)}ms linear 0s`,
      position: 'absolute',
      userSelect: 'none',
      whiteSpace: 'pre',
      perspective: '500px',
      cursor: 'none',
      pointerEvents: 'none'
    }
    const style: CSSStyleDeclaration = this.dom.style
    Object.entries(patchStyle).forEach(([k, v]: any): void => {
      style[k] = v
    })
    return this
  }
}
