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
  const result: Partial<Pick<T, K[number]>> = {};

  if (!source) {
    return result as Pick<T, K[number]>;
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
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

  const keysLen = keys.length;

  // For 0-3 keys, direct comparison is faster than Set
  if (keysLen === 0) {
    return { ...source } as Omit<T, K[number]>;
  }

  const result: Partial<T> = {};

  if (keysLen <= 3) {
    // Fast path for small omit lists
    const sourceKeys = Reflect.ownKeys(source) as (keyof T)[];
    for (let i = 0; i < sourceKeys.length; i++) {
      const key = sourceKeys[i];
      let shouldOmit = false;
      for (let j = 0; j < keysLen; j++) {
        if (key === keys[j]) {
          shouldOmit = true;
          break;
        }
      }
      if (!shouldOmit) {
        result[key] = source[key];
      }
    }
  } else {
    // Set is faster for larger omit lists
    const keysToOmit = new Set<PropertyKey>(keys as readonly PropertyKey[]);
    const sourceKeys = Reflect.ownKeys(source) as (keyof T)[];
    for (let i = 0; i < sourceKeys.length; i++) {
      const key = sourceKeys[i];
      if (!keysToOmit.has(key)) {
        result[key] = source[key];
      }
    }
  }

  return result as Omit<T, K[number]>;
}
