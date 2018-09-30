// @flow
import { Dtrack } from '../track';
import { initMergeDefaultParams } from "../util/init-options";
import { Dnode } from "../node";
import * as __CONFIG__ from "../config";
import * as __EVENT__ from "../event/control";
import { DanmakuControlPlayStatus } from "../config";
import { DanmakuControlEventName } from "../config";

/**
 * @author August-Z
 * @version 2018.09.28
 * @remark 使用时请引用 instance
 * 用于弹幕 player 的控制
 */
export class DanmakuPlayer {

  el: HTMLElement
  rollingTime: number
  nodeTag: string
  nodeClass: string
  nodeValueKey: any
  trackCount: number
  trackHeight: number
  trackList: Array<Dtrack>
  list: Array<Dnode>
  nodeList: Array<Dnode>
  playTimer: any
  cleanTimer: any
  playStatus: number | string
  on: { [key: any]: Function }

  static instanceControl: DanmakuPlayer

  constructor (ops: DanmakuPlayerOptions) {
    if (!window) {
      throw new Error('请在浏览器环境下运行')
    }
    this.playStatus = DanmakuControlPlayStatus.EMPTY
    initMergeDefaultParams(ops, {
      el: document.body,
      rollingTime: 6000,
      nodeTag: 'div',
      nodeClass: '',
      nodeValueKey: 'value',
      trackCount: 5,
      trackHeight: 40,
      on: {}
    }, this)
    if (ops.hasOwnProperty('list')) {
      this.insertDanmaku(ops.list)
    }
    this.list = []
    this.trackList = []
    this._init()
  }

  get playerWidth (): number {
    return this.el.clientWidth || 0
  }

  static getInstanceControl (ops: DanmakuPlayerOptions | any): DanmakuPlayer {
    if (!DanmakuPlayer.instanceControl) {
      DanmakuPlayer.instanceControl = new DanmakuPlayer(ops)
    }
    return DanmakuPlayer.instanceControl
  }

  /**
   * 向弹幕播放器中添加弹幕
   * @param danmaku<Array<DnodeOptions> | DnodeOptions | string>
   */
  insertDanmaku (danmaku: any): void {
    this.list.push(
      ...this._handleDanmakuOps(danmaku).map((ops: DnodeOptions) => new Dnode(ops))
    )
  }

  play (): DanmakuPlayer {
    if (!Array.isArray(this.list)) {
      throw new TypeError('list must instanceof Array')
    }
    this.playTimer = setInterval(() => {
      this.playTick()
    }, __CONFIG__.DanmakuControlConfig.LAUNCH_LOOP_TIME)
    this.playStatus = DanmakuControlPlayStatus.PLAY
    this._controlHook(DanmakuControlEventName.PLAY)
    return this
  }

  playTick (): void {
    if (this.list.length && this.trackList.some((t: Dtrack) => t.unObstructed)) {
      const node: Dnode = this.list.shift()  // <Dnode>
      if (node) {
        // noinspection JSAnnotator
        node.run().then((n: Dnode) => {
          // change node status => run complete
          n.removeDnode()
        })
      }
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
    const unObstructedTrackList: Array<Dtrack> = this.trackList.filter((t: Dtrack) => t.unObstructed);
    const index: number = typeof trackIndex === 'number'
      ? trackIndex
      : Math.floor(Math.random() * unObstructedTrackList.length)
    return unObstructedTrackList[index]
  }

  _init (): DanmakuPlayer {
    this._checkElement()
    this._bindControlStyle()
    this._initTrackList()
    this.playStatus = DanmakuControlPlayStatus.INIT
    this._controlHook(DanmakuControlEventName.INIT)
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
    }
    return this
  }

  _bindControlStyle (): DanmakuPlayer {
    this.el.style.position = 'relative'
    this.el.style.overflow = 'hidden'
    // this.el.style.userSelect = 'none'
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
      throw new TypeError('Bad param!')
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
