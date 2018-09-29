// @flow

// 可计算一段弹幕文字的宽与高
export function translateTextToWidth (text: string, textDom: HTMLElement): DnodeSize {
  textDom.textContent = text;
  return {
    width: parseFloat(window.getComputedStyle(textDom).width),
    height: parseFloat(window.getComputedStyle(textDom).height)
  };
}
