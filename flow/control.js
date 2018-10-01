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
