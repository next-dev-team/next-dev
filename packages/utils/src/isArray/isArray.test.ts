import isArray from '.';

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
