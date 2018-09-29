export function initMergeDefaultParams (ctx: any, ops: object, defaultOps: object): object {
  if (!(ops instanceof Object) || !(defaultOps instanceof Object)) {
    throw new TypeError('params must instanceof Object !')
  }
  Object.entries(ops).forEach(([k, v]) => {
    if (defaultOps.hasOwnProperty(k)) {
      defaultOps[k] = v
    }
  })
  Object.entries(defaultOps).forEach(([k, v]) => {
    ctx[k] = v
  })
  return ctx
}
