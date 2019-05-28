import { ITrack } from "../track/ITrack"

/**
 * 弹幕
 */
export interface IDanmaku {
  readonly player: any,
  track?: ITrack,
  text: string,
  speed: number,
  launchTime: number,
  totalTime: number
}

export const enum DanmakuRunStatus {
  EMPTY,
  INIT,
  READY,
  RUNNING,
  LAUNCHED,
  RUN_END,
}
