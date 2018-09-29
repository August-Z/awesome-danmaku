// @flow
import * as __CONFIG__ from "../config"
import $ from 'jquery'
import { initMergeDefaultParams } from "../util/init-options";
import { translateTextToWidth } from "../util/text-size";
import { Dtrack } from "../track";
import { DanmakuPlayer } from "../control";

export class Dnode {
  control: DanmakuPlayer
  text: string
  width: number
  height: number
  fontSize: number | string
  fontFamily: string
  color: string
  translateX: number
  launchTime: number
  dom: HTMLElement

  static instanceTextSizeDom: HTMLElement

  constructor (ops: string | Object, control: DanmakuPlayer) {
    if (typeof ops === 'string') {
      this.text = ops
      this.control = control
    } else if (ops instanceof Object) {
      initMergeDefaultParams(this, ops, {
        control: DanmakuPlayer.getInstanceControl(),
        text: '',
        fontSize: __CONFIG__.DnodeDefaultConfig.FONT_SIZE,
        fontFamily: __CONFIG__.DnodeDefaultConfig.FONT_FAMILY,
        color: __CONFIG__.DnodeDefaultConfig.COLOR
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

  patch (): Dnode {
    this.dom = document.createElement(this.control.nodeTag)
    this.dom.className = this.control.nodeClass
    this.dom.style.fontSize = this.fontSize + 'px'
    this.dom.style.fontFamily = this.fontFamily
    this.dom.style.color = this.color
    this.dom.innerText = this.text
    return this
  }

  render (ctx: HTMLElement): Dnode {
    if (this.dom instanceof HTMLElement) {
      ctx
        ? ctx.appendChild(this.dom)
        : this.control.wrap.appendChild(this.dom)
      return this
    }
    throw new Error('Dnode needs HTMLElement to render function !')
  }

  html (): string {
    return `<div class="danmaku-item">${this.text}</div>\r\n`;
  }

  /**
   * 弹幕进入轨道
   * @param track<Dtrack>
   * @remark 此时弹幕已经 checked，尚未渲染
   */
  joinTrack (track: Dtrack): void {
    const node = this
    const nodeDom = this.dom
    nodeDom.style.top = `${track.getTopByMiddleDnode(node.height)}px`
    nodeDom.style.transform = 'translate3d(0, 0, 0)'
    track.rolling((t) => {
      console.log('track.rolling - ctx:', this)
      nodeDom.style.transform = `translate3d(${node.translateX}px, 0, 0)`
      setTimeout(() => {
        t.stopRolling()
      }, node.launchTime)
    })
  }

  _init () {
    this._computeTextSize();
    this._computeDistance();
  }

  _computeTextSize () {
    const { width, height } = translateTextToWidth(this.text, Dnode.getInstanceTemplateDom())
    this.width = width
    this.height = height
  }

  _computeDistance () {
    const totalDis: number = this.control.playerWidth + this.width
    this.translateX = (-1) * totalDis
    this.launchTime = Math.round(this.control.rollingTime * (this.width / totalDis));
  }
}
