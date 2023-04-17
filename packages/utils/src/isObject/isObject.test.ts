import isObject from '.';

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
