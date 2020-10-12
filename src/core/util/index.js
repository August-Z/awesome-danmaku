// @flow

export function isNumber (o: any): %checks {
  return typeof o === 'number'
}

export function isFunction(o: any): %checks {
  return typeof o === 'function'
}
