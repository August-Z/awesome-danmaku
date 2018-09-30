// @flow
import * as __CONFIG__ from "../config"
import { translateTextToSize } from "../util/text-size";
import { Dtrack } from "../track";
import { DanmakuPlayer } from "../control";

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

  static instanceTextSizeDom: HTMLElement

  constructor (ops: string | DnodeOptions, control?: DanmakuPlayer = DanmakuPlayer.getInstanceControl()) {
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
    this._init()
  }

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

  /**
   * 开始滚动
   */
  run (): any {
    return new Promise((resolve, reject) => {
      this._joinTrack()._patch()._render()
      try {
        this.track.rolling((t) => {
          this.dom.style.transform = `translate3d(${this.translateX}px, 0, 0)`
          setTimeout(() => {
            t.stopRolling()
          }, this.launchTime)
          setTimeout(() => {
            this.remove()
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

  remove (): Dnode {
    if (this.dom instanceof HTMLElement && this.control.wrap instanceof HTMLElement) {
      if (this.dom.parentElement === this.control.wrap) {
        this.control.wrap.removeChild(this.dom)
      } else {
        throw new Error('Control Dom not is node dom parent，Can\'t remove node！')
      }
    } else {
      throw new TypeError('Control Dom or Node Dom not HTMLElement !')
    }
    return this
  }

  removeDnode (): void {
    delete this
  }

  _init (): Dnode {
    this._computedTextSize()
    this._computedTotalDistance()
    return this
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

  /**
   * 修补节点 attr、style 并创建 DOM
   * @returns {Dnode}
   */
  _patch (): Dnode {
    const nodeDom: HTMLElement = document.createElement(this.control.nodeTag)
    nodeDom.className = this.control.nodeClass
    nodeDom.innerText = this.text
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
    const style: CSSStyleDeclaration = nodeDom.style
    Object.entries(patchStyle).forEach(([k, v]: any): void => {
      style[k] = v
    })
    this.dom = nodeDom
    return this
  }

  /**
   * 渲染 dom
   * @param ctx
   * @returns {Dnode}
   */
  _render (ctx?: HTMLElement): Dnode {
    if (this.dom instanceof HTMLElement) {
      ctx
        ? ctx.appendChild(this.dom)
        : this.control.wrap.appendChild(this.dom)
      return this
    }
    throw new Error('Dnode needs HTMLElement to render function !')
  }
}
