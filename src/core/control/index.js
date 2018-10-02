// @flow
import * as __CONFIG__ from "../config";
import * as __EVENT__ from "../event/control";
import { Dtrack } from '../track';
import { Dnode } from "../node";
import { DanmakuControlPlayStatus } from "../config";
import { DanmakuControlEventName } from "../config";
import { initMergeDefaultParams } from "../util/init-options";
import { DnodeRunStatus } from "../config/node";

/**
 * @author August-Z
 * @version 2018.09.28
 * @remark 使用时请引用 instance
 * 用于弹幕 player 的控制
 */
export class DanmakuPlayer {

  _loopTime: number

  el: HTMLElement
  rollingTime: number
  nodeTag: string
  nodeClass: string
  nodeMaxCount: number
  nodeValueKey: any
  trackCount: number
  trackHeight: number
  trackList: Array<Dtrack> = []
  nodeList: Array<Dnode> = []
  list: Array<DnodeOptions> = []
  playTimer: any
  cleanTimer: any
  playStatus: number | string
  on: { [key: any]: Function }

  static __lock__: boolean
  static instanceControl: DanmakuPlayer

  constructor (ops: DanmakuPlayerOptions | HTMLElement | string) {
    if (!window) {
      throw new Error('Please run in browser support.')
    } else if (DanmakuPlayer.__lock__ !== true) {
      throw new Error('Please use the \"getPlayer\" function instead of creating objects.')
    }
    this.playStatus = DanmakuControlPlayStatus.EMPTY
    this._handleOptions(ops)
    this._init()
  }

  get playerWidth (): number {
    return this.el.clientWidth || 0
  }

  get hasTasks (): boolean {
    return (
      !!this.list.length &&
      this.trackList.some((t: Dtrack) => t.unObstructed) &&
      this.nodeList.some((n: Dnode) => n.unObstructed)
    )
  }

  static getPlayer (ops: DanmakuPlayerOptions | any): DanmakuPlayer {
    if (!DanmakuPlayer.instanceControl) {
      DanmakuPlayer.__lock__ = true
      DanmakuPlayer.instanceControl = new DanmakuPlayer(ops)
    }
    return DanmakuPlayer.instanceControl
  }

  /**
   * 向弹幕播放器中添加弹幕
   * @param danmaku<Array<DnodeOptions> | DnodeOptions | string>
   */
  insert (danmaku: any): Array<DnodeOptions> {
    this.list.push(
      ...this._handleDanmakuOps(danmaku)
    )
    return this.list
  }

  play (): DanmakuPlayer {
    if (!Array.isArray(this.list)) {
      throw new TypeError('list must instanceof Array')
    }
    this.playTimer = setInterval(() => {
      this.playTick()
    }, this._loopTime)
    this.playStatus = DanmakuControlPlayStatus.PLAY
    this._controlHook(DanmakuControlEventName.PLAY)
    return this
  }

  playTick (): void {
    if (this.hasTasks) {
      const nodeOps: DnodeOptions = this.list.shift()
      const node: Dnode = this.getUnObstructedNode()
      node.patch(nodeOps).run().then((n: Dnode) => {
        // todo run end hook
        n.runStatus = DnodeRunStatus.RUN_END
      })
    }
  }

  pause (): DanmakuPlayer {
    clearInterval(this.playTimer)
    this.playStatus = DanmakuControlPlayStatus.PAUSED
    this._controlHook(DanmakuControlEventName.PAUSE)
    return this
  }

  stop (): DanmakuPlayer {
    clearInterval(this.playTimer)
    this.clearList()
    this.playStatus = DanmakuControlPlayStatus.STOP
    this._controlHook(DanmakuControlEventName.STOP)
    return this
  }

  clearList (): DanmakuPlayer {
    this.list = []
    return this
  }

  getUnObstructedTrack (trackIndex?: number): Dtrack {
    const unObstructedTrackList: Array<Dtrack> = this.trackList.filter((t: Dtrack) => t.unObstructed)
    const index: number = typeof trackIndex === 'number'
      ? trackIndex
      : Math.floor(Math.random() * unObstructedTrackList.length)
    return unObstructedTrackList[index]
  }

  getUnObstructedNode (nodeIndex?: number): Dnode {
    const unObstructedNodeList: Array<Dnode> = this.nodeList.filter((n: Dnode) => n.unObstructed)
    const index: number = typeof nodeIndex === 'number'
      ? nodeIndex
      : Math.floor(Math.random() * unObstructedNodeList.length)
    return unObstructedNodeList[index]
  }

  _handleOptions (ops: DanmakuPlayerOptions | HTMLElement | string): DanmakuPlayer {
    const playerDefaultConfig = __CONFIG__.DanmakuPlayDefaultConfig.getDefault
    if (typeof ops === 'string' || ops instanceof HTMLElement) {
      initMergeDefaultParams({}, {
        el: ops,
        ...playerDefaultConfig
      }, this)
    } else if (ops instanceof Object || Object.prototype.toString.call(ops) === '[object Object]') {
      initMergeDefaultParams(ops, {
        el: document.body,
        ...playerDefaultConfig
      }, this)
      if (ops.hasOwnProperty('list')) {
        this.insert(ops.list)
      }
    } else {
      throw new Error('Control error, bad param(options) !')
    }
    return this
  }

  _init (): DanmakuPlayer {
    this._initSelfConfig()
    this._checkElement()
    this._bindControlStyle()
    this._initTrackList()
    this._initNodeList()
    this.playStatus = DanmakuControlPlayStatus.INIT
    this._controlHook(DanmakuControlEventName.INIT)
    return this
  }

  _initSelfConfig (): DanmakuPlayer {
    this._loopTime = Number(Math.round(this.rollingTime / this.nodeMaxCount) + __CONFIG__.TICK_TIME)
    return this
  }

  _checkElement (): DanmakuPlayer {
    if (typeof this.el === 'string') {
      const _el = document.querySelector(this.el)
      if (_el === null) {
        throw new Error('Control dom(el) query for no result')
      } else {
        this.el = _el
      }
    } else if (!(this.el instanceof HTMLElement)) {
      throw new Error('Control[el] not is HTMLElement, check code !')
    }
    return this
  }

  _bindControlStyle (): DanmakuPlayer {
    // this.el.style.userSelect = 'none'
    this.el.style.position = 'relative'
    this.el.style.overflow = 'hidden'
    this.el.style.cursor = 'none'
    this.el.style.pointerEvents = 'none'
    this.el.style.verticalAlign = 'baseline'
    return this
  }

  _initTrackList (): DanmakuPlayer {
    for (let i = 0; i < this.trackCount; i++) {
      this.trackList.push(new Dtrack({
        index: i,
        width: this.playerWidth,
        height: this.trackHeight
      }))
    }
    return this
  }

  _initNodeList (): DanmakuPlayer {
    let nodeListHTML: string = ''
    const nodeTag: string = this.nodeTag.toLowerCase()
    debugger
    for (let i = 0; i < this.nodeMaxCount; i++) {
      // language=HTML
      nodeListHTML += `<${nodeTag} class="${this.nodeClass}"></${nodeTag}>`
    }
    this.el.innerHTML = nodeListHTML
    setTimeout(() => {
      const domCollection: HTMLCollection<HTMLElement> = this.el.getElementsByClassName(this.nodeClass)
      this.nodeList = Array.prototype.slice
        .call(domCollection)
        .map((nodeDom: HTMLElement) => {
          return new Dnode({
            control: this,
            text: '',
            ...__CONFIG__.DnodeDefaultConfig.getDefault
          }).init(nodeDom)
        })
    }, __CONFIG__.TICK_TIME)
    return this
  }

  _handleDanmakuOps (ops: any): Array<DnodeOptions> {
    const danmakuOpsArray: Array<DnodeOptions> = []
    if (Array.isArray(ops) || Object.prototype.toString.call(ops) === '[object Array]') {
      danmakuOpsArray.push(
        ...ops.map((o) => this._transformDnodeOps(o))
      )
    } else {
      danmakuOpsArray.push(
        this._transformDnodeOps(ops)
      )
    }
    return danmakuOpsArray
  }

  _transformDnodeOps (ops: string | Object): DnodeOptions {
    if (typeof ops === 'string') {
      return {
        control: this,
        text: ops,
        ...__CONFIG__.DnodeDefaultConfig.getDefault
      }
    } else if (ops instanceof Object) {
      return initMergeDefaultParams(ops, {
        control: this,
        text: ops.hasOwnProperty(this.nodeValueKey) ? ops[this.nodeValueKey] : '',
        ...__CONFIG__.DnodeDefaultConfig.getDefault
      })
    } else {
      throw new TypeError('TransformDnodeOps error, Bad param!')
    }
  }

  _controlHook (eventName: string): void {
    if (this.on.hasOwnProperty(eventName) && typeof this.on[eventName] === 'function') {
      __EVENT__.controlEmitter.hook(DanmakuControlEventName.INIT, () => {
        this.on[eventName](this)
      })
    }
  }

}
