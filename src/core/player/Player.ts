import { IPlayer, PlayerStatus } from "../../interface/player/IPlayer"
import { Track } from "../track/Track"
import { Danmaku } from "../danmaku/Danmaku"

/**
 * 弹幕状态机
 */
export class Player implements IPlayer {

  public static getPlayer (ops: PlayerOptions): Player {
    if (!this.instance) {
      this.instanceLock = true
      this.instance = new Player(ops)
    }
    return this.instance
  }

  private static instanceLock: boolean = false
  private static instance: Player

  public playQueue: DanmakuOptions[] = []
  public danmakuList: Danmaku[] = []
  public trackList: Track[] = []
  public el: HTMLElement = document.body
  public status: PlayerStatus

  private loopTime: number = 0
  private overlap: number = 0

  constructor (ops: PlayerOptions) {
    if (!window) {
      throw new Error('Please run in browser support.')
    } else if (Player.instanceLock) {
      throw new Error('Please use the \"getPlayer\" function instead of creating objects.')
    }
    this.status = PlayerStatus.EMPTY

    // handle DOM element
    if (typeof ops === "string") {
      const el = document.querySelector(ops)
      if (el instanceof HTMLElement) {
        this.el = el
      }
    } else if (ops instanceof HTMLElement) {
      this.el = ops
    } else {
      // ops instanceof Object
      if (typeof ops.el === 'string') {
        const el = document.querySelector(ops.el)
        if (el instanceof HTMLElement) {
          this.el = el
        }
      } else {
        if (ops.el instanceof HTMLElement) {
          this.el = ops.el
        }
      }
    }

    // handle other options
    // todo
  }

  public change (key: string, value: any): IPlayer
  public change (obj: Object): IPlayer {
    return this
  }

  public insert (danmakuOps: DanmakuOptions, sync?: boolean): IPlayer {
    return this
  }

  public play (): IPlayer {
    return this
  }

  public pause (): IPlayer {
    return this
  }

  public stop (): IPlayer {
    return this
  }

  /**
   * 清空播放队列
   */
  public clear (): IPlayer {
    if (Array.isArray(this.playQueue) && this.playQueue.length) {
      this.playQueue = []
    }
    return this
  }

  private getUnObstructedTrack (trackIndex?: number): Track {
    const unObstructedTrackList: Track[] = this.trackList.filter((t: Track) => t.unObstructed)
    const index: number = typeof trackIndex === 'number'
      ? trackIndex
      : Math.floor(Math.random() * unObstructedTrackList.length)
    return unObstructedTrackList[index]
  }

  private getUnObstructedNode (nodeIndex?: number): Danmaku {
    const unObstructedNodeList: Danmaku[] = this.danmakuList.filter((n: Danmaku) => n.unObstructed)
    const index: number = typeof nodeIndex === 'number'
      ? nodeIndex
      : Math.floor(Math.random() * unObstructedNodeList.length)
    return unObstructedNodeList[index]
  }
}
