import { Dtrack } from '../track';
import * as DanmakuConfig from '../config';

/**
 * @author August-Z
 * @version 2018.09.28
 * @remark 使用时请引用 instance
 * 用于弹幕 player 的控制
 */
export class DanmakuPlayer {

  wrap: HTMLElement
  rollingTime: number = 6000
  nodeTag: string = 'div'
  nodeClass: string

  constructor (ops) {
    // todo
    this.$danmakuBox = ops.$danmakuBox;
    this.danmakuList = [];
    this.trackList = [];
    this._initTrackList(ops.trackLength);
  }

  get playerWidth (): number {
    return this.wrap.clientWidth
  }

  static getInstanceControl ({ $danmakuBox = null, trackLength = 7, danmakuList = [] }) {
    if (!DanmakuPlayer.instanceControl) {
      DanmakuPlayer.instanceControl = new DanmakuPlayer({
        $danmakuBox, trackLength, danmakuList
      });
    }
    return DanmakuPlayer.instanceControl;
  }

  /**
   * 向弹幕播放器中添加弹幕
   * @param danmaku<Array<DnodeOptions> | DnodeOptions | string>
   */
  insertDanmaku (danmaku: Array<DnodeOptions> | DnodeOptions | string) {
    const checkValue = (d) => d instanceof Object && d.hasOwnProperty('value');
    if (Array.isArray(danmaku)) {
      if (danmaku.every((d) => checkValue(d))) {
        this.danmakuList.push(...danmaku.map((d) => new Dnode({
          text: d.value,
          control: this
        })));
      } else {
        throw new Error('Insert Error, danmaku value check fail! Array has bad value!');
      }
    } else if (checkValue(danmaku)) {
      this.danmakuList.push(new Dnode({
        text: danmaku.value,
        control: this
      }));
    } else if (typeof danmaku === 'string' && danmaku.length) {
      this.danmakuList.push(new Dnode({
        text: danmaku,
        control: this
      }));
    } else {
      throw new Error('Insert Error, danmaku value check fail! Bad Param !');
    }
  }

  run () {
    if (!Array.isArray(this.danmakuList)) {
      throw new TypeError('danmakuList must instanceof Array');
    }
    let i = 0;
    const instanceTimer = setInterval(() => {
      if (this.danmakuList.length && this.trackList.some((t) => t.unObstructed)) {
        const track = this.getUnObstructedTrack(); // <Dtrack>
        const node = this.danmakuList[i++];  // <Dnode>
        node.patch().joinTrack(track).render()
      }
    }, 200);
  }

  getUnObstructedTrack (trackIndex) {
    const unObstructedTrackList = this.trackList.filter((t) => t.unObstructed);
    const index = typeof trackIndex === 'number'
      ? trackIndex
      : Math.floor(Math.random() * unObstructedTrackList.length);
    return unObstructedTrackList[index];
  }

  _initTrackList (len) {
    for (let i = 0; i < len; i++) {
      this.trackList.push(new Dtrack({
        index: i,
        width: DanmakuConfig.PLAYER_WIDTH,
        height: DanmakuConfig.TRACK_HEIGHT
      }));
    }
  }
}
