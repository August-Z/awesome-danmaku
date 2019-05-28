export interface IPlayer {
  insert: (danmakuOps: DanmakuOptions, sync?: boolean) => IPlayer,
  play: () => IPlayer,
  pause: () => IPlayer,
  stop: () => IPlayer,
  clear: () => IPlayer,
  change: (k: string, val: any) => IPlayer
}

export const enum PlayerStatus {
  EMPTY,
  INIT,
  STOP,
  PLAY,
  PAUSED
}
