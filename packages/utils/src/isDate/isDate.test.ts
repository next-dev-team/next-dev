import isDate from '.';
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
