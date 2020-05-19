// @flow

/**
 * 可计算一段弹幕文字的宽与高
 * @param text {string} 弹幕字符串
 * @param textDom {HTMLElement} 可输入文本的元素，推荐单例
 * @returns {DnodeSize} 弹幕尺寸（宽高）
 */
export function translateTextToSize (text: string, textDom: HTMLElement): DnodeSize {
  textDom.textContent = text
  const { width, height } = window.getComputedStyle(textDom)
  return {
    width: parseFloat(width),
    height: parseFloat(height)
  }
}

/**
 * 通过渲染，计算字符串的宽高
 * @param text {string} 弹幕字符串
 * @param font {string} 文本设置
 * @param renderingContext2D {CanvasRenderingContext2D} 画布，这里推荐实现单例
 * @returns {TextMetrics} 弹幕尺寸（宽高）
 */
export function renderTextToSize (text: string = '', font: string = '', renderingContext2D: CanvasRenderingContext2D): TextMetrics {
  renderingContext2D.font = font
  return renderingContext2D.measureText(text)
}
