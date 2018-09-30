// @flow
export class DanmakuEvent {
  hooks: Set<string>

  constructor (hooks: Array<string>) {
    this.hooks = new Set()
    Object.entries(hooks).forEach(([key, hook]: any) => {
      this.hooks.add(hook)
    })
  }

  hook (hook: string, cb: Function) {
    // todo Global hook log or action.
  }
}
