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

  /**
   * @author August-Z
   * @remark 设置轨道的重叠程度，值越高代表了重叠程度越小，反之亦然
   * The area must between 0 ~ 2.
   * normal value is 1 ,can use float.
   * @param val
   */
  setOverlap (val: number) {
    if (val < 0 || val > 2) {
      throw new RangeError('Param => overlap must be between 0 and 2 of int or float.')
    }
    this.overlap = val === 1 ? 1 : 2.0 - val
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
