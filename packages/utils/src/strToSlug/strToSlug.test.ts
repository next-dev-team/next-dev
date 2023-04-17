//@ts-nocheck
import toSlug from '.';

// --------------------------toSlug-----------------------------------

describe('toSlug', () => {
  it('should return an empty string if the input is an empty string', () => {
    expect(toSlug('')).toBe('');
  });

  it('should return an empty string if the input is null', () => {
    expect(toSlug(null)).toBe('');
  });

  it('should return an empty string if the input is undefined', () => {
    expect(toSlug(undefined)).toBe('');
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
