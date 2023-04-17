//@ts-nocheck
// --------------------- Omit --------------------------

import pick from '.';

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
