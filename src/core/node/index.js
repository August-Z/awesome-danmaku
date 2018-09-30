// @flow
import * as __CONFIG__ from "../config"
import { initMergeDefaultParams } from "../util/init-options";
import { translateTextToWidth } from "../util/text-size";
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

  constructor (ops: string | Object, control?: DanmakuPlayer = DanmakuPlayer.getInstanceControl()) {
    if (typeof ops === 'string') {
      this.text = ops
      this.control = control
    } else if (ops instanceof Object) {
      initMergeDefaultParams(this, ops, {
        control: DanmakuPlayer.getInstanceControl(),
        text: '',
        fontSize: __CONFIG__.DnodeDefaultConfig.FONT_SIZE,
        fontFamily: __CONFIG__.DnodeDefaultConfig.FONT_FAMILY,
        color: __CONFIG__.DnodeDefaultConfig.COLOR,
        speed: __CONFIG__.DnodeDefaultConfig.SPEED,
      })
    }
    this._init()
  }

  static getInstanceTemplateDom (ops: DnodeTemplateDom = {
    visibility: 'hidden',
    fontSize: __CONFIG__.DnodeDefaultConfig.FONT_SIZE + 'px',
    fontFamily: __CONFIG__.DnodeDefaultConfig.FONT_FAMILY,
    display: 'inline-block'
  }): HTMLElement {
    if (!Dnode.instanceTextSizeDom) {
      const template: HTMLElement = document.createElement('span')
      template.style.visibility = ops.visibility
      template.style.fontSize = ops.fontSize
      template.style.fontFamily = ops.fontFamily
      template.style.display = ops.display
      if (document.body) {
        document.body.appendChild(template);
      }
      Dnode.instanceTextSizeDom = template;
    }
    return Dnode.instanceTextSizeDom;
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
            // todo: hook kill dom
            resolve(this)
          }, this.control.rollingTime)
        })
      } catch (e) {
        reject(e)
      } finally {
        console.log('Dnode is run:', this)
      }
    })

    // todo 运行完后的销毁动作

  }

  _init (): Dnode {
    this._computeTextSize()
    this._computeDistance()
    return this
  }

  _computeTextSize (): void {
    const { width, height } = translateTextToWidth(this.text, Dnode.getInstanceTemplateDom())
    this.width = width
    this.height = height
  }

  _computeDistance (): void {
    const totalDis: number = this.control.playerWidth + this.width
    this.translateX = (-1) * totalDis
    this.launchTime = Math.round(this.control.rollingTime * (this.width / totalDis));
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
    const styleStr = Object.entries(patchStyle).reduce((tol, [k, v]: any): any => tol += `${k}: ${v};`, '')
    nodeDom.setAttribute('style', `"${styleStr}"`)
    // nodeDom.style.fontSize = this.fontSize + 'px'
    // nodeDom.style.fontFamily = this.fontFamily
    // nodeDom.style.color = this.color
    // nodeDom.style.top = `${this.track.getTopByMiddleDnode(this.height)}px`
    // nodeDom.style.left = `${this.control.playerWidth}px`
    // nodeDom.style.transform = `translate3d(0, 0, 0)`
    // nodeDom.style.transition = `transform ${Math.round(this.control.rollingTime / this.speed)}ms linear 0s`
    // nodeDom.style.position = 'absolute'
    // nodeDom.style.userSelect = 'none'
    // nodeDom.style.whiteSpace = 'pre'
    // nodeDom.style.perspective = '500px'
    // nodeDom.style.display = 'inline-block'
    // nodeDom.style.opacity = '1'
    // nodeDom.style.lineHeight = '1.125'
    // nodeDom.style.cursor = 'none'
    // nodeDom.style.pointerEvents = 'none'
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
