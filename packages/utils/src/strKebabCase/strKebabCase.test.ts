import kebabCase from '.';

// --------------------------kebabCase-----------------------------------
describe('kebabCase', () => {
  it('should convert a string to kebab-case', () => {
    expect(kebabCase('hello world')).toBe('hello-world');
    expect(kebabCase('HelloWorld')).toBe('hello-world');
    expect(kebabCase('hello   world')).toBe('hello-world');
    expect(kebabCase('helloWorld')).toBe('hello-world');
  });
});
