// @flow

export class Dtrack {
  status: number
  index: number
  height: number
  offsetTop: number
  overlap: number
  static ROLLING: number = 1
  static UN_ROLLING: number = 0

  constructor (ops: DtrackOptions) {
    this.status = Dtrack.UN_ROLLING
    this.index = ops.index
    this.height = ops.height
    this.offsetTop = ops.height * ops.index
    this.setOverlap(ops.overlap)
  }

  setOverlap (val: number) {
    this.overlap = 1 - val / 2 > 0.5
      ? 1 - val / 2
      : 0.5
  }

  rolling (cb: Function, delay: number = 20): void {
    setTimeout(() => {
      this.status = Dtrack.ROLLING
      typeof cb === 'function' && cb(this)
    }, delay)
  }

  stopRolling (): void {
    this.status = Dtrack.UN_ROLLING
  }

  /**
   * 获取垂直居中后的 Dnode 高度
   * @param nodeHeight<number>
   * @returns {number}
   */
  getTopByMiddleDnode (nodeHeight: number): number {
    return this.offsetTop + (this.height - nodeHeight) / 2
  }

  get obstructed (): boolean {
    return this.status === Dtrack.ROLLING
  }

  get unObstructed (): boolean {
    return this.status === Dtrack.UN_ROLLING
  }
}
