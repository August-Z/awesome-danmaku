// @flow
import { isNumber } from "./index";

/**
 * 通过渲染，计算字符串的宽
 * @param text {string} 弹幕字符串
 * @param font {string} 文本设置
 * @param renderingContext2D {CanvasRenderingContext2D} 画布，这里推荐实现单例
 * @returns {number} 文本宽
 */
export function measureTextWidth (text: string = '', font: string = '', renderingContext2D: CanvasRenderingContext2D): number {
  renderingContext2D.font = font
  const { actualBoundingBoxLeft, actualBoundingBoxRight, width } = renderingContext2D.measureText(text)

  /**
   * @link https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics
   * 当测量一段文字，的总和的x方向actualBoundingBoxLeft和  actualBoundingBoxRight可以比内框（的宽度宽width），由于倾斜/斜体字体其中字符悬其超前宽度。
   * 因此，使用的总和actualBoundingBoxLeft和  actualBoundingBoxRight作为获取绝对文本宽度的更准确的方法可能很有用
   */
  return (isNumber(actualBoundingBoxLeft) && isNumber(actualBoundingBoxRight))
    ? Math.abs(actualBoundingBoxLeft) + Math.abs(actualBoundingBoxRight)
    : (isNumber(width) ? width : 0)
}
