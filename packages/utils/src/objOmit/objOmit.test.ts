//@ts-nocheck
// -------------------- omit ------------------------

import omit from '.';
import { AnyObject } from '..';

describe('omit', () => {
  it('should return a new object without the specified keys', () => {
    const input: AnyObject = { a: 1, b: 2, c: 3, d: 4 };
    const keysToOmit = ['b', 'd'];

    const result = omit(input, keysToOmit);

    expect(result).toEqual({ a: 1, c: 3 });
  });
  it('should not modify the original object and return a new object with omitted keys', () => {
    const input: AnyObject = { a: 1, b: 2, c: 3, d: 4 };
    const keysToOmit = ['b', 'd'];
    const result = omit(input, keysToOmit);

    // Check if the original object is not modified
    expect(input).toEqual({ a: 1, b: 2, c: 3, d: 4 });

    // Check if the result object has the expected properties after omitting the keys
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('should return an empty object if all keys are omitted', () => {
    const input: AnyObject = { a: 1, b: 2, c: 3, d: 4 };
    const keysToOmit = ['a', 'b', 'c', 'd'];

    const result = omit(input, keysToOmit);

    expect(result).toEqual({});
  });

  it('should return the original object if no keys are omitted', () => {
    const input: AnyObject = { a: 1, b: 2, c: 3, d: 4 };
    const keysToOmit: string[] = [];

    const result = omit(input, keysToOmit);

    expect(result).toEqual(input);
  });

  it('should handle empty input objects', () => {
    const input: AnyObject = {};
    const keysToOmit = ['a', 'b', 'c', 'd'];

    const result = omit(input, keysToOmit);

    expect(result).toEqual({});
  });

  it('should ignore non-existent keys in keysToOmit', () => {
    const input: AnyObject = { a: 1, b: 2, c: 3, d: 4 };
    const keysToOmit = ['x', 'y', 'z'];

    const result = omit(input, keysToOmit);

    expect(result).toEqual(input);
  });
});
