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
