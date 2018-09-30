// @flow

export function initMergeDefaultParams (ops: Object, defaultOps: Object, ctx?: Object): Object {
  if (!(ops instanceof Object) || !(defaultOps instanceof Object)) {
    throw new TypeError('params must instanceof Object !')
  }
  Object.entries(ops).forEach(([k, v]) => {
    if (defaultOps.hasOwnProperty(k)) {
      defaultOps[k] = v
    }
  })
  const defaultOpsObject = Object.entries(defaultOps)
  return (ctx && ctx instanceof Object)
    ? initMergeDefaultParamsToContext(ctx, defaultOpsObject)
    : initMergeDefaultParamsToResult(defaultOpsObject)
}

function initMergeDefaultParamsToContext (ctx: Object, defaultOpsObject: Array<any>): Object {
  defaultOpsObject.forEach(([k, v]) => {
    ctx[k] = v
  })
  return ctx
}

function initMergeDefaultParamsToResult (defaultOpsObject: Array<any>): Object {
  const result = {}
  defaultOpsObject.forEach(([k, v]) => {
    result[k] = v
  })
  return result
}
