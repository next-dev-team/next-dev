import {
  isArray,
  isBoolean,
  isDate,
  isEmpty,
  isEqual,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isUndefined,
} from './';

// --------------------- isDate --------------------------
test('isEqual returns true for equal primitive values', () => {
  expect(isEqual(1, 1)).toBe(true);
  expect(isEqual('test', 'test')).toBe(true);
  expect(isEqual(true, true)).toBe(true);
});

test('isEqual returns false for different primitive values', () => {
  expect(isEqual(1, 2)).toBe(false);
  expect(isEqual('test', 'testing')).toBe(false);
  expect(isEqual(true, false)).toBe(false);
});

test('isEqual returns true for equal objects', () => {
  const objA = { a: 1, b: 2, c: { d: 3 } };
  const objB = { a: 1, b: 2, c: { d: 3 } };
  expect(isEqual(objA, objB)).toBe(true);
});

test('isEqual returns false for different objects', () => {
  const objA = { a: 1, b: 2, c: { d: 3 } };
  const objB = { a: 1, b: 2, c: { d: 4 } };
  expect(isEqual(objA, objB)).toBe(false);
});
// --------------------- isDate --------------------------
describe('isDate', () => {
  it('should return true for date objects', () => {
    expect(isDate(new Date())).toBe(true);
  });

  it('should return false for non-date values', () => {
    expect(isDate(undefined)).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate('')).toBe(false);
    expect(isDate('2022-01-01')).toBe(false);
    expect(isDate(0)).toBe(false);
    expect(isDate(false)).toBe(false);
    expect(isDate({})).toBe(false);
    expect(isDate([])).toBe(false);
    expect(isDate(NaN)).toBe(false);
  });
});
// --------------------- isUndefined --------------------------
describe('isUndefined', () => {
  it('should return true for undefined values', () => {
    expect(isUndefined(undefined)).toBe(true);
  });

  it('should return false for defined values', () => {
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined(false)).toBe(false);
    expect(isUndefined({})).toBe(false);
    expect(isUndefined([])).toBe(false);
  });
});
// --------------------- isNumber --------------------------
describe('isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(42)).toBe(true);
    expect(isNumber(Math.PI)).toBe(true);
  });

  it('should return false for non-numbers', () => {
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber('')).toBe(false);
    expect(isNumber('42')).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber(NaN)).toBe(false);
  });
});
// --------------------- isNull --------------------------
describe('isNull', () => {
  it('should return true for null values', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false for non-null values', () => {
    expect(isNull(undefined)).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull(0)).toBe(false);
    expect(isNull(false)).toBe(false);
    expect(isNull({})).toBe(false);
    expect(isNull([])).toBe(false);
  });
});
// --------------------- isFunction --------------------------
describe('isFunction', () => {
  it('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
  });

  it('should return false for non-functions', () => {
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(42)).toBe(false);
    expect(isFunction('test')).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});
// --------------------- isEmpty --------------------------
describe('isEmpty', () => {
  it('should return true for null or undefined values', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return true for empty strings or arrays', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
  });

  it('should return true for empty objects', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for non-empty values', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

// --------------------- isBoolean --------------------------
describe('isBoolean', () => {
  test('returns true for boolean values', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  test('returns false for non-boolean values', () => {
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean(42)).toBe(false);
    expect(isBoolean('hello')).toBe(false);
    expect(isBoolean({})).toBe(false);
    expect(isBoolean([])).toBe(false);
  });
});

// --------------------- isObject --------------------------
describe('isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: 'value' })).toBe(true);
    expect(isObject(new Date())).toBe(true);
    expect(isObject([])).toBe(true); // updated this line
  });

  it('should return false for non-objects', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(Symbol())).toBe(false);
    expect(isObject(() => {})).toBe(false);
  });
});
// --------------------- isArray --------------------------
describe('isArray function', () => {
  it('should return true if the argument is an array', () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray(['foo', 'bar'])).toBe(true);
  });

  it('should return false if the argument is not an array', () => {
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray(42)).toBe(false);
    expect(isArray('foo')).toBe(false);
    expect(isArray({ key: 'value' })).toBe(false);
  });
});
