/**
 * 弹幕轨道
 */
export interface ITrack {
  readonly index: number
  width: number
  height: number
}

/**
 * 弹幕轨道状态
 */
export const enum TrackStatus {
  ROLLING,
  UN_ROLLING,
}
