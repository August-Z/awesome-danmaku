// @flow
import { renderTextToSize } from "../util/text-size";
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
  launchTimer: TimeoutID | null = null
  runningTimer: TimeoutID | null = null

  static instanceTextSizeDom: HTMLElement
  static instanceTextSizeCanvas: HTMLCanvasElement
  static instanceTextSizeCanvasRenderingContext2D: CanvasRenderingContext2D

  constructor (ops: DnodeOptions) {
    this.runStatus = DnodeRunStatus.EMPTY
    this._init(ops)
  }

  get unObstructed (): boolean {
    return DnodeRunStatus.INIT === this.runStatus || DnodeRunStatus.RUN_END === this.runStatus
  }

  getDrawStyle (): { [key: string]: string | number } {
    return {
      'display': 'inline-block',
      'width': `${this.width}px`,
      'height': `${this.height}px`,
      'line-height': `${this.height}px`,
      'font-size': `${this.fontSize}px`,
      'font-family': this.fontFamily,
      'font-weight': this.fontWeight,
      'color': this.color,
      'top': `${this.track.getTopByMiddleDnode(this.height)}px`,
      'left': `${this.control.playerWidth}px`,
      'opacity': this.opacity + '',
      'transform': `translate3d(0, 0, 0)`,
      'transition': `transform ${this.totalTime}ms linear 0s`,
      'position': 'absolute',
      'user-select': 'none',
      'white-space': 'nowrap',
      'cursor': 'none',
      'pointer-events': 'none'
    }
  }

  /**
   * 用于计算弹幕节点尺寸的单例 Canvas 2D 上下文
   * @returns {HTMLCanvasElement}
   */
  static getInstanceCanvasRenderingContext2D () {
    if (!this.instanceTextSizeCanvas) {
      const canvas = document.createElement('canvas')
      canvas.id = 'awesome-danmaku__canvas-rendering-2d'
      canvas.style.display = 'none'
      if (window && document.body) {
        document.body.appendChild(canvas)
      }

      this.instanceTextSizeCanvas = canvas
      this.instanceTextSizeCanvasRenderingContext2D = canvas.getContext('2d')
    }
    return this.instanceTextSizeCanvasRenderingContext2D
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

      // 经过了发射区域，弹幕文字已经全部显示于轨道中，此处 Status => Launched，该时间受轨道的允许覆盖率(0%-100%)影响
      if (this.launchTimer) {
        clearTimeout(this.launchTimer)
        this.launchTimer = null
      }
      this.launchTimer = setTimeout(() => {
        t.stopRolling()
        this.runStatus = DnodeRunStatus.LAUNCHED
      }, this.launchTime)

      // 弹幕经过了总运动时长，此时已到达轨道终点，此处 Status => RunEnd
      if (typeof cb === 'function') {
        if (this.runningTimer) {
          clearTimeout(this.runningTimer)
          this.runningTimer = null
        }
        this.runningTimer = setTimeout(() => {
          typeof cb === 'function' && cb(this)
        }, this.totalTime)
      }
    })
  }

  /**
   * Dnode 正式开始运动，发射
   */
  launch (): Dnode {
    this.runStatus = DnodeRunStatus.RUNNING
    // this.dom.style.display = 'inline-block'
    this.dom.style.transform = `translate3d(${this.translateX}px, 0, 0)`
    return this
  }

  /**
   * Dnode 运动完毕，隐藏并归位
   */
  flyBack (): Dnode {
    this.runStatus = DnodeRunStatus.RUN_END
    // this.dom.textContent = ''   // ?? 是否需要有待测试
    // this.dom.style.display = 'none'
    this.dom.style.transition = 'none'
    this.dom.style.transform = 'translate3d(0, 0, 0)'
    return this
  }

  _init (ops: DnodeOptions): void {
    this.text = ops.text
    this.control = ops.control
    this.fontSize = ops.fontSize
    this.fontFamily = ops.fontFamily
    this.fontWeight = ops.fontWeight
    this.opacity = ops.opacity
    this.color = ops.color
    this.speed = ops.speed
  }

  _computedTextSize (): void {
    const renderFont = `${this.fontSize}px ${this.fontFamily}`
    const { width } = renderTextToSize(this.text, renderFont, Dnode.getInstanceCanvasRenderingContext2D())
    this.width = Math.ceil(width) + Number(this.fontSize) // 多算一个字体大小的宽度，形成一定的偏移量来处理边界情况
    this.height = this.control.trackHeight
  }

  _computedTotalDistance (): void {
    const totalDis: number = this.control.playerWidth + this.width
    this.translateX = (-1) * totalDis
    this.launchTime = Math.ceil(this.control.rollingTime * (this.width / totalDis))
    this.totalTime = Math.ceil(this.control.rollingTime / this.speed)
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
    this.dom.textContent = this.text
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
    const drawStyle = this.getDrawStyle()
    let drawStyleText: string = ''
    for (const k in drawStyle) {
      drawStyleText += `${k}: ${drawStyle[k]};`
    }
    this.dom.style.cssText = drawStyleText
    return this
  }

}
