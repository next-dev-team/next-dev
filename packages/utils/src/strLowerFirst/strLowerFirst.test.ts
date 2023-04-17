
import lowerFirst from '.';

// --------------------------lowerFirst-----------------------------------
describe('lowerFirst', () => {
  test('should return the string with the first letter in lowercase', () => {
    expect(lowerFirst('Hello')).toBe('hello');
    expect(lowerFirst('World')).toBe('world');
  });

  test('should return the string unchanged if the first letter is already lowercase', () => {
    expect(lowerFirst('hello')).toBe('hello');
    expect(lowerFirst('world')).toBe('world');
  });

  test('should return the string unchanged if it contains only non-letter characters', () => {
    expect(lowerFirst('123')).toBe('123');
    expect(lowerFirst('!@#')).toBe('!@#');
  });

  test('should return an empty string if the input is an empty string', () => {
    expect(lowerFirst('')).toBe('');
  });
});
