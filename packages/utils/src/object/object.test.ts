//@ts-nocheck
// --------------------- Omit --------------------------

import { omit, pick } from '.';
import { AnyObject } from '..';

// --------------------------pick--------------------------------------

describe('pick', () => {
  it('should pick specified keys from the input object', () => {
    const input = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    const result = pick(input, 'a', 'c');

    expect(result).toEqual({
      a: 1,
      c: 3,
    });
  });

  it('should return an empty object if no keys are specified', () => {
    const input = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    const result = pick(input);

    expect(result).toEqual({});
  });

  it('should ignore non-existent keys', () => {
    const input = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    const result = pick(input, 'a', 'e');

    expect(result).toEqual({
      a: 1,
    });
  });

  it('should work with an empty input object', () => {
    const input = {};

    const result = pick(input, 'a', 'b');

    expect(result).toEqual({});
  });

  it('should work with various types of keys', () => {
    const input = {
      a: 1,
      b: 'hello',
      c: [1, 2, 3],
      d: { x: 5, y: 6 },
    };

    const result = pick(input, 'a', 'b', 'c', 'd');

    expect(result).toEqual({
      a: 1,
      b: 'hello',
      c: [1, 2, 3],
      d: { x: 5, y: 6 },
    });
  });
});
// -------------------- omit ------------------------

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
