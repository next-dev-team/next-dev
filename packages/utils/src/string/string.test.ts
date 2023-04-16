//@ts-nocheck
import {
  camelCase,
  capitalize,
  kebabCase,
  lowerFirst,
  toSlug,
  truncate,
  upperCase,
} from '.';

// --------------------------truncate-----------------------------------
describe('truncate', () => {
  it('should return the same string if the length is greater than or equal to the input length', () => {
    const input = 'Hello, world!';
    const length = input.length;

    const result = truncate(input, length);

    expect(result).toBe(input);
  });

  it('should truncate the input string and add " if the length is less than the input length', () => {
    const input = 'Hello, world!';
    const length = 5;

    const result = truncate(input, length);

    expect(result).toBe('Hello...');
  });

  it('should throw an error if the length is negative or not a number', () => {
    const input = 'Hello, world!';
    const length = -5;

    expect(() => truncate(input, length)).toThrow('Invalid length value');
    expect(() => truncate(input, NaN)).toThrow('Invalid length value');
  });
});
// --------------------------upperCase-----------------------------------
describe('upperCase', () => {
  it('should return the input string in uppercase', () => {
    const input = 'hello world';
    const expectedOutput = 'HELLO WORLD';

    expect(upperCase(input)).toEqual(expectedOutput);
  });

  it('should return an empty string when the input is empty', () => {
    const input = '';
    const expectedOutput = '';

    expect(upperCase(input)).toEqual(expectedOutput);
  });
});
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
// --------------------------kebabCase-----------------------------------
describe('kebabCase', () => {
  it('should convert a string to kebab-case', () => {
    expect(kebabCase('hello world')).toBe('hello-world');
    expect(kebabCase('HelloWorld')).toBe('hello-world');
    expect(kebabCase('hello   world')).toBe('hello-world');
    expect(kebabCase('helloWorld')).toBe('hello-world');
  });
});
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

// --------------------------toSlug-----------------------------------

describe('toSlug', () => {
  it('should return an empty string if the input is an empty string', () => {
    expect(toSlug('')).toBe('');
  });

  it('should return an empty string if the input is null', () => {
    expect(toSlug(null as any)).toBe('');
  });

  it('should return an empty string if the input is undefined', () => {
    expect(toSlug(undefined as any)).toBe('');
  });

  it('should convert a string to a slug format', () => {
    expect(toSlug('Hello World')).toBe('hello-world');
  });

  it('should remove non-alphanumeric characters', () => {
    expect(toSlug('Hello!#$%&*()+={}[]|;:?.,<>@`^~ World')).toBe('hello-world');
  });

  it('should replace multiple spaces with a single hyphen', () => {
    expect(toSlug('Hello     World')).toBe('hello-world');
  });

  it('should replace multiple hyphens with a single hyphen', () => {
    expect(toSlug('Hello--World')).toBe('hello-world');
  });

  it('should trim leading and trailing spaces', () => {
    expect(toSlug('  Hello World  ')).toBe('hello-world');
  });
});
