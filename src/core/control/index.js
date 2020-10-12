// @flow
import * as __CONFIG__ from "../config";
import * as __EVENT__ from "../event/control";
import { Dtrack } from '../track';
import { Dnode } from "../node";
import { DanmakuControlPlayStatus } from "../config";
import { DanmakuControlEventName } from "../config";
import { initMergeDefaultParams } from "../util/init-options";
import { DanmakuControlEvent } from "../event";


/**
 * @author August-Z
 * @version 2018.09.28
 * @remark 使用时请引用 instance
 * 用于弹幕 player 的控制
 */
export class DanmakuPlayer {

  _loopTime: number
  _overlap: number
  _elementMap: WeakMap<HTMLElement, Dnode>

  el: HTMLElement
  playerWidth: number
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
    this._registerEvent()
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
   * @param danmakuOps
   * @param sync {boolean} 是否同步
   */
  insert (danmakuOps: any, sync: boolean = false): Array<DnodeOptions> {
    if (sync) {
      // 同步模式，发送的文本会实时显示 (这里不经过发送队列，直接创建一个临时的 Dnode)
      const nodeTag: string = this.nodeTag.toLowerCase()
      const nodeDom: HTMLElement = document.createElement(nodeTag)
      const nodeOps: DnodeOptions = this._handleDanmakuOps(danmakuOps).shift()
      const node: Dnode = new Dnode({
        control: this,
        ...__CONFIG__.DnodeDefaultConfig.getDefault,
        ...nodeOps
      }).init(nodeDom)

      let optionClass: string = ''
      if ('nodeClass' in nodeOps && nodeOps.nodeClass) {
        if (Array.isArray(nodeOps.nodeClass) && nodeOps.nodeClass.every((v) => typeof v === 'string')) {
          optionClass = nodeOps.nodeClass.join(' ')
        } else if (typeof nodeOps.nodeClass === 'string') {
          optionClass = nodeOps.nodeClass
        }
      }

      nodeDom.setAttribute('class', `${ this.nodeClass } ${ optionClass }`)
      this.el.appendChild(nodeDom) // echo reflow and replant
      node.patch(nodeOps).run((n: Dnode) => {
        this.el.removeChild(nodeDom)
        delete node.dom
      })
    } else {
      // 常规的异步模式，弹幕的发送会经过发送队列
      this.list.push(
        ...this._handleDanmakuOps(danmakuOps)
      )
    }
    return this.list
  }


  play (): DanmakuPlayer {

    if (!Array.isArray(this.list)) {
      throw new TypeError('list must instanceof Array')
    } else if (['static', 'static !important', ''].includes(getComputedStyle(this.el).position)) {
      throw new Error(
        'Play error! el (wrap dom) position can\'t is static or empty, \n' +
        'Please set \"relative\"、\"absolute\" or \"fixed\".'
      )
    }

    let self = this
    let counter = 0

    function tickTask () {
      requestAnimationFrame(tickTask)
      if (++counter % self._overlap === 0) {
        counter = 0
        self.playTick()
      }
    }

    requestAnimationFrame(tickTask)

    this.playStatus = DanmakuControlPlayStatus.PLAY
    this._controlHook(DanmakuControlEventName.PLAY)
    return this
  }

  playTick (): void {
    if (this.hasTasks && this.playStatus === DanmakuControlPlayStatus.PLAY) {
      const options = this.list.shift()
      const node = this.getUnObstructedNode()
      node && node.patch(options).run()
    }
  }

  pause (): DanmakuPlayer {
    this.playStatus = DanmakuControlPlayStatus.PAUSED
    this._controlHook(DanmakuControlEventName.PAUSE)
    return this
  }

  stop (): DanmakuPlayer {
    this.playStatus = DanmakuControlPlayStatus.STOP
    this._controlHook(DanmakuControlEventName.STOP)
    this.clearList()
    return this
  }

  clearList (): DanmakuPlayer {
    if (Array.isArray(this.list) && this.list.length) {
      this.list = []
    }
    return this
  }

  /**
   * 修改控制器的参数，这可以是动态的修改，并会有相应的函数作出反应（如果该 key 是存在且可以被更改的）
   * @param key 对应键
   * @param val 修改值
   */
  change (key: string, val: any) {
    switch (key) {
      case 'opacity':
        this._changeOpacity(Number(val))
        break
      case 'speed' :
        this._changeSpeed(Number(val))
        break
      case 'overlap':
        this._changeOverlap(Number(val))
        break
      default:
        console.warn(
          `[Change WARN]: The player not has \'${ key }\' param! Or this property is readonly.\n`
        )
    }
  }

  getUnObstructedTrack (): Dtrack | null {
    const trackList = this.trackList
    for (let i = 0, len = this.trackCount; i < len; i++) {
      if (trackList[i].unObstructed) {
        return trackList[i]
      }
    }
    return null
  }

  getUnObstructedNode (): Dnode | null {
    const nodeList = this.nodeList
    for (let i = 0, len = this.nodeMaxCount; i < len; i++) {
      if (nodeList[i].unObstructed) {
        return nodeList[i]
      }
    }
    return null
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

  _registerEvent (): void {
    if (!this.el) {
      return undefined
    }
    window.addEventListener("orientationchange", (e) => {
      const value = screen.orientation
        ? screen.orientation.angle
        : e.orientation
      console.log(value)
      switch (value) {
        case 0:
        case 180:
          this.playerWidth = this.el.clientWidth
          break
        case 90:
        case -90:
          this.playerWidth = this.el.clientHeight
          break
      }
    }, false)
    this.el.addEventListener('resize', (e) => {
      this.playerWidth = this.el.clientWidth
    })
    this.el.addEventListener('transitionend', (e) => {
      if (e && e.target) {
        const element: EventTarget = e.target
        if (!(element instanceof HTMLElement)) {
          return undefined
        }
        let node: Dnode | void
        if (this._elementMap.has(element)) {
          node = this._elementMap.get(element)
        } else {
          for (let i = 0, len = this.nodeList.length, item; i < len; i++) {
            item = this.nodeList[i]
            if (item.dom === element) {
              node = item
              break
            }
          }
        }
        node && node.flyBack()
      }
    })
  }

  _initSelfConfig (): DanmakuPlayer {
    this._loopTime = Number(Math.round(this.rollingTime / this.nodeMaxCount) + __CONFIG__.TICK_TIME)
    this._overlap = 15
    return this
  }

  _checkElement (): DanmakuPlayer {
    if (typeof this.el === 'string') {
      const _el = document.querySelector(this.el)
      if (_el === null) {
        throw new Error('Control dom(el) query for no result')
      } else {
        this.el = _el
        this.playerWidth = _el.clientWidth
      }
    } else if (!(this.el instanceof HTMLElement)) {
      throw new Error('Control[el] not is HTMLElement, check code !')
    }
    return this
  }

  _bindControlStyle (): DanmakuPlayer {
    const controlStyleList: string[] = [
      'overflow: hidden;',
      'cursor: none;',
      'pointer-events: none;',
      'vertical-align: baseline;',
      'transform: translateZ(0);'
    ]
    if (['', 'static'].includes(getComputedStyle(this.el).position)) {
      controlStyleList.push('position: relative;')
    }
    this.el.style.cssText = controlStyleList.join('')
    return this
  }

  _initTrackList (): DanmakuPlayer {
    const playerWidth = this.playerWidth
    const trackHeight = this.trackHeight
    for (let i = 0, len = this.trackCount; i < len; i++) {
      this.trackList[i] = new Dtrack({
        index: i,
        width: playerWidth,
        height: trackHeight
      })
    }
    return this
  }

  _initNodeList (): DanmakuPlayer {
    let nodeListHTML: string = ''
    const nodeTag: string = this.nodeTag.toLowerCase()
    for (let i = 0; i < this.nodeMaxCount; i++) {
      // language=HTML
      nodeListHTML += `<${ nodeTag } class="${ this.nodeClass }" danmaku></${ nodeTag }>`
    }
    this.el.innerHTML = nodeListHTML
    this._elementMap = new WeakMap()
    const that = this
    requestAnimationFrame(() => {
      const domCollection: HTMLCollection<HTMLElement> = this.el.getElementsByClassName(this.nodeClass)
      this.nodeList = Array.prototype.slice
        .call(domCollection)
        .map((nodeDom: HTMLElement) => {
          const node = new Dnode({
            control: this,
            text: '',
            ...__CONFIG__.DnodeDefaultConfig.getDefault
          }).init(nodeDom)
          that._elementMap.set(nodeDom, node)
          return node
        })
    })
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

  _changeDensity (): void {
    // todo
  }

  _changeSpeed (val: number): void {
    if (Number.isNaN(val)) {
      throw new Error(
        'Change Error, speed type must be number, not NaN !\n' +
        'Please check speed param !'
      )
    } else if (val < 0) {
      throw new Error(
        'Change Error, opacity value must be greater than 0.\n'
      )
    }

    // 改变所有节点
    this.nodeList.forEach((n: Dnode) => {
      n.speed = val
    })

    // 改变队列中的配置
    this.list.forEach((nodeOps: DnodeOptions) => {
      nodeOps.speed = val
    })
  }

  _changeOpacity (val: number): void {
    if (Number.isNaN(val)) {
      throw new Error(
        'Change Error, opacity type must be number, not NaN !\n' +
        'Please check opacity param !'
      )
    } else if (val < 0 || val > 1) {
      throw new Error(
        'Change Error, opacity value must between 0 and 1.\n'
      )
    }

    // 改变所有节点
    this.nodeList
      .map((n: Dnode) => n.dom)
      .forEach((dom: HTMLElement) => {
        dom.style.opacity = val + ''
      })

    // 改变队列中的配置
    this.list.forEach((nodeOps: DnodeOptions) => {
      nodeOps.opacity = val
    })
  }

  /**
   * 映射到 overlap 值 (1～20)
   * @param val 0.00 - 1.00
   * @private
   */
  _changeOverlap (val: number): void {
    let v = Math.round((1 - val) * 20) + 5
    this._overlap = Math.min(25, Math.max(5, v))
  }

  _controlHook (hookName: string): void {
    if (this.on.hasOwnProperty(hookName) && typeof this.on[hookName] === 'function') {
      __EVENT__.controlEmitter.hook(hookName, (emitter: DanmakuControlEvent, hook: string) => {
        this.on[hookName](this, emitter, hook)
      })
    }
  }

}
