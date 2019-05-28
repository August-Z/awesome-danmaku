import { ITrack, TrackStatus } from "../../interface/track/ITrack"

/**
 * 弹幕轨道
 * @author August-Z
 */
export class Track implements ITrack {
  public readonly index: number
  public height: number
  public width: number
  public status: TrackStatus = TrackStatus.UN_ROLLING
  public offsetTop: number

  constructor (ops: ITrack) {
    this.index = ops.index
    this.width = ops.width
    this.height = ops.height
    this.offsetTop = ops.height * ops.index
  }

  public get obstructed (): boolean {
    return this.status === TrackStatus.ROLLING
  }

  public get unObstructed (): boolean {
    return this.status === TrackStatus.UN_ROLLING
  }
}
