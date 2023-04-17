
import truncate from '.';

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
