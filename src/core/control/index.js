// @flow
import { Dtrack } from '../track';
import { initMergeDefaultParams } from "../util/init-options";
import { Dnode } from "../node";

/**
 * @author August-Z
 * @version 2018.09.28
 * @remark 使用时请引用 instance
 * 用于弹幕 player 的控制
 */
export class DanmakuPlayer {

  wrap: HTMLElement
  rollingTime: number
  nodeTag: string
  nodeClass: string
  nodeValueKey: string
  trackCount: number
  trackHeight: number
  trackList: Array<Dtrack>
  list: Array<Object>
  playTimer: any

  constructor (ops: DanmakuPlayerOptions) {
    if (!window) {
      throw new Error('请在浏览器环境下运行')
    }
    initMergeDefaultParams(this, ops, {
      wrap: document.body,
      rollingTime: 6000,
      nodeTag: 'div',
      nodeClass: '',
      nodeValueKey: 'value',
      trackCount: 5,
      trackHeight: 40
    })
    if (ops.hasOwnProperty('list')) {
      this.insertDanmaku(ops.list)
    }
    this.list = []
    this.trackList = []
    this._init()
  }

  get playerWidth (): number {
    return this.wrap.clientWidth || 0
  }

  static instanceControl: DanmakuPlayer

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
  insertDanmaku (danmaku: any) {
    const checkValue = (d) => d instanceof Object && d.hasOwnProperty(this.nodeValueKey)
    if (Array.isArray(danmaku)) {
      if (danmaku.every((d) => checkValue(d))) {
        this.list.push(...danmaku.map((d) => new Dnode({
          text: d[this.nodeValueKey],
          control: this
        })));
      } else {
        throw new Error('Insert Error, danmaku value check fail! Array has bad value!')
      }
    } else if (checkValue(danmaku)) {
      this.list.push(new Dnode({
        text: danmaku[this.nodeValueKey],
        control: this
      }))
    } else if (typeof danmaku === 'string' && danmaku.length) {
      this.list.push(new Dnode({
        text: danmaku,
        control: this
      }))
    } else {
      throw new Error('Insert Error, danmaku value check fail! Bad Param !')
    }
  }

  play (): DanmakuPlayer {
    if (!Array.isArray(this.list)) {
      throw new TypeError('list must instanceof Array')
    }
    this.playTimer = setInterval(() => {
      if (this.list.length && this.trackList.some((t: Dtrack) => t.unObstructed)) {
        const node: Dnode = this.list.shift()  // <Dnode>
        if (node) {
          node.run().then((n: Dnode) => {
            console.log('Dnode run over:', n)
          })
        }
      }
    }, 200)
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
    this._bindControlStyle()
    this._initTrackList()
    return this
  }

  _bindControlStyle (): DanmakuPlayer {
    this.wrap.style.position = 'relative'
    this.wrap.style.overflow = 'hidden'
    // this.wrap.style.userSelect = 'none'
    this.wrap.style.cursor = 'none'
    this.wrap.style.pointerEvents = 'none'
    this.wrap.style.verticalAlign = 'baseline'
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
}
