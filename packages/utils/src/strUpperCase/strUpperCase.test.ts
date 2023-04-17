import upperCase from '.';

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
