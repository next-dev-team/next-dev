//@ts-nocheck

import capitalize from '.';

// --------------------------capitalize-----------------------------------
describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
  });

  it('should return an empty string if the input is not a string', () => {
    expect(capitalize(null)).toBe('');
    expect(capitalize(undefined)).toBe('');
    expect(capitalize(123 as any)).toBe('');
  });

  it("should not modify the input if it's already capitalized", () => {
    expect(capitalize('Hello')).toBe('Hello');
    expect(capitalize('World')).toBe('World');
  });

  it('should handle single-character strings', () => {
    expect(capitalize('h')).toBe('H');
    expect(capitalize('')).toBe('');
  });
});
