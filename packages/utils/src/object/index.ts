import { AnyObject } from '..';

/**
 * The `pick` function takes an object and a list of keys,
 * and returns a new object containing only the specified keys.
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => (key in obj ? { ...acc, [key]: obj[key] } : acc),
    {} as Pick<T, K>,
  );
}

export function omit<T extends AnyObject>(
  object: T,
  keysToOmit: string[],
): Partial<T> {
  const result: Partial<T> = {};
  Object.keys(object).forEach((key) => {
    if (!keysToOmit.includes(key)) {
      result[key as keyof T] = object[key as keyof T];
    }
  });
  return result;
}
