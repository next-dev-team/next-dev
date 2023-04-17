import isNumber from '.';

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
