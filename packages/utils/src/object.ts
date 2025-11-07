const hasOwn = Object.prototype.hasOwnProperty;

type AnyRecord = Record<PropertyKey, unknown>;

/**
 * Pick a subset of properties from an object.
 * @param source - The source object to pick properties from.
 * @param keys - The property keys to include in the resulting object.
 */
export function pick<T extends AnyRecord, const K extends readonly (keyof T)[] | []>(
  source: T | null | undefined,
  keys: K,
): Pick<T, K[number]> {
  if (!source) {
    return {} as Pick<T, K[number]>;
  }

  if (keys.length === 0) {
    return {} as Pick<T, K[number]>;
  }

  const result: Partial<Pick<T, K[number]>> = {};

  for (const key of keys) {
    if (hasOwn.call(source, key)) {
      result[key] = source[key];
    }
  }

  return result as Pick<T, K[number]>;
}

/**
 * Omit a subset of properties from an object.
 * @param source - The source object to omit properties from.
 * @param keys - The property keys to remove from the resulting object.
 */
export function omit<T extends AnyRecord, const K extends readonly (keyof T)[] | []>(
  source: T | null | undefined,
  keys: K,
): Omit<T, K[number]> {
  if (!source) {
    return {} as Omit<T, K[number]>;
  }

  if (keys.length === 0) {
    return { ...source } as Omit<T, K[number]>;
  }

  const keysToOmit = new Set<PropertyKey>(keys as readonly PropertyKey[]);
  const result: Partial<Omit<T, K[number]>> = {};

  for (const key of Reflect.ownKeys(source) as (keyof T)[]) {
    if (!keysToOmit.has(key)) {
      result[key] = source[key];
    }
  }

  return result as Omit<T, K[number]>;
}

