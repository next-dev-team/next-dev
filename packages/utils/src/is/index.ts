export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isEqual(a[key], b[key])) return false;
  }

  return true;
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN((value as Date).getTime());
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export const isFunction = (value: any): value is Function => {
  return typeof value === 'function';
};

export function isEmpty(value: any): value is boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

export const isArray = <T>(arr: unknown): arr is T[] => Array.isArray(arr);

export const isBrowser = typeof window !== 'undefined';
export const isNavigator = typeof navigator !== 'undefined';

export const _isClient =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.matchMedia !== 'undefined';
