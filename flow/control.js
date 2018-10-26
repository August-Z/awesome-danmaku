declare type DanmakuPlayerOptions = {
  el: ?HTMLElement | string;
  rollingTime: number | string;
  nodeTag: string;
  nodeClass: string;
  nodeMaxCount: number;
  nodeValueKey: number | string;
  trackCount: number;
  trackHeight: number | string;
  list: Array<string | Object | DnodeOptions>;
  on: { [key: string]: Function };
}

/**
 * todo params rename of Player options
 * last time: 2018.11.11
 */
declare type _DanmakuPlayerOptions = {
  el: ?HTMLElement | string;
  totalTime: number | string;
  tag: string;
  class: string;
  maxCount: number;
  valueKey: number | string;
  rowCount: number;
  list: Array<string | Object | DnodeOptions>;
  on: { [key: string]: Function };
}
