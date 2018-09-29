// @flow

export class Dtrack {
  status: number
  index: number
  height: number
  offsetTop: number
  static ROLLING: number = 1
  static UN_ROLLING: number = 0

  constructor (ops: DtrackOptions) {
    this.status = Dtrack.UN_ROLLING
    this.index = ops.index
    this.height = ops.height
    this.offsetTop = ops.height * ops.index
  }

  rolling (cb: function, delay: number = 20): void {
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
  getTopByMiddleDnode (nodeHeight: number) {
    return this.offsetTop + (this.height - nodeHeight) / 2
  }

  get obstructed () {
    return this.status === Dtrack.ROLLING
  }

  get unObstructed () {
    return this.status === Dtrack.UN_ROLLING
  }
}
