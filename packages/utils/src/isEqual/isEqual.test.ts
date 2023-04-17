import isEqual from '.';

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
