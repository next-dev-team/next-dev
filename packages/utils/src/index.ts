// content: #is , #object , string

export type AnyObject = { [key: string]: any }

// ----------------------------#is------------------------------
export { default as isArray } from './isArray'
export { default as isBoolean } from './isBoolean'
export { default as isClient } from './isClient'
export { default as isDate } from './isDate'
export { deepEqual, shallowEqual, strictDeepEqual } from './isDeepEqual'
export { default as isEmpty } from './isEmpty'
export { default as isFunction } from './isFunction'
export { default as isNull } from './isNull'
export { default as isObject } from './isObject'
export { default as isString } from './isString'
export { default as isUndefined } from './isUndefined'
// ----------------------------#object------------------------------
export { default as objOmit } from './objOmit'
export { default as objPick } from './objPick'
// ----------------------------#string------------------------------
export { default as noop } from './noop'
export { default as strCamelCase } from './strCamelCase'
export { default as strCapitalize } from './strCapitalize'
export { default as strKebabCase } from './strKebabCase'
export { default as strLowerFirst } from './strLowerFirst'
export { default as strToSlug } from './strToSlug'
export { default as strTruncate } from './strTruncate'
export { default as strUpperCase } from './strUpperCase'
// ----------------------------#DOM------------------------------
export { default as htmlPrint } from './htmlPrint'
