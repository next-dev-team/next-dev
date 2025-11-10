import { describe, expect, it } from 'vitest';

import { omit, pick } from '../object';

describe('pick', () => {
  it('returns only the requested properties', () => {
    const source = { id: 1, name: 'Alice', age: 30 };

    const result = pick(source, ['id', 'name'] as const);

    expect(result).toStrictEqual({ id: 1, name: 'Alice' });
    expect(Object.keys(result)).toHaveLength(2);
  });

  it('ignores missing keys and prototype properties', () => {
    const proto = { inherited: true };
    const source = Object.create(proto, {
      present: {
        value: 42,
        enumerable: true,
      },
    }) as { present: number; missing?: string };

    const result = pick(source, ['present', 'missing'] as const);

    expect(result).toStrictEqual({ present: 42 });
    expect('inherited' in result).toBe(false);
  });

  it('handles nullish input gracefully', () => {
    expect(pick(null, ['a'] as const)).toStrictEqual({});
    expect(pick(undefined, ['a'] as const)).toStrictEqual({});
  });

  it('returns an empty object when no keys are provided', () => {
    const source = { id: 1, name: 'Alice' };

    const result = pick(source, [] as const);

    expect(result).toStrictEqual({});
  });
});

describe('omit', () => {
  it('removes specified keys', () => {
    const source = { id: 1, secret: 'hidden', role: 'admin' };

    const result = omit(source, ['secret'] as const);

    expect(result).toStrictEqual({ id: 1, role: 'admin' });
  });

  it('preserves symbol keys unless omitted', () => {
    const sym = Symbol('token');
    const source = { id: 1, [sym]: 'value' };

    expect(omit(source, ['id'] as const)).toStrictEqual({ [sym]: 'value' });
    expect(omit(source, [sym] as const)).toStrictEqual({ id: 1 });
  });

  it('returns a shallow clone when no keys are omitted', () => {
    const source = { id: 1, count: 2 };

    const result = omit(source, [] as const);

    expect(result).toStrictEqual(source);
    expect(result).not.toBe(source);
  });

  it('handles nullish input gracefully', () => {
    expect(omit(null, ['a'] as const)).toStrictEqual({});
    expect(omit(undefined, ['a'] as const)).toStrictEqual({});
  });
});

describe('type inference', () => {
  it('narrows the resulting type for pick and omit', () => {
    const source = { id: 1, name: 'Alice', active: true };

    const picked = pick(source, ['id'] as const);
    const omitted = omit(source, ['active'] as const);

    type Picked = typeof picked;
    type Omitted = typeof omitted;

    const expectPicked: Picked = { id: 1 };
    const expectOmitted: Omitted = { id: 1, name: 'Alice' };

    expect(expectPicked).toStrictEqual({ id: 1 });
    expect(expectOmitted).toStrictEqual({ id: 1, name: 'Alice' });
  });
});
