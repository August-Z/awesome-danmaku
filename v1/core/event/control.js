// @flow
import { DanmakuControlEventName } from "../config";
import { DanmakuEvent } from "./event";

export class DanmakuControlEvent extends DanmakuEvent {

  constructor (ops: any) {
    super(ops)
  }

  hook (hook: string, cb: Function): void {
    if (this.hooks.has(hook)) {
      cb(this, hook)
      return
    }
    throw new Error(`[Event Error]: Hook error, Not has ${hook} event !`)
  }
}

export const controlEmitter = new DanmakuControlEvent(DanmakuControlEventName)
