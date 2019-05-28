/**
 * 可计算一段弹幕文字的宽与高
 * @param text
 * @param textDom
 * @returns TextSizeResult
 */
export function translateTextToSize (text: string, textDom: HTMLElement): TextSizeResult {
  const result: TextSizeResult = {
    width: 0,
    height: 0
  }
  if (textDom instanceof HTMLElement) {
    textDom.textContent = text
    let w = window.getComputedStyle(textDom).width
    let h = window.getComputedStyle(textDom).height
    if (w) {
      result.width = Number.parseFloat(w)
    }
    if (h) {
      result.height = Number.parseFloat(h)
    }
  }
  return result
}
