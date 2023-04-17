//@ts-nocheck
import camelCase from '.';

// --------------------------camelCase-----------------------------------

describe('camelCase', () => {
  it('should convert a string to camelCase', () => {
    expect(camelCase('hello world')).toBe('helloWorld');
    expect(camelCase('Camel Case Function')).toBe('camelCaseFunction');
    expect(camelCase('another example here')).toBe('anotherExampleHere');
  });

  it('should return an empty string if the input is empty', () => {
    expect(camelCase('')).toBe('');
  });

  it('should handle special characters and numbers', () => {
    expect(camelCase('example 123')).toBe('example123');
    expect(camelCase('example!@#$%^&*()')).toBe('example');
    expect(camelCase('example with!@# special%$^ chars*&()')).toBe(
      'exampleWithSpecialChars',
    );
  });
});
