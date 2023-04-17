/**
 * The `pick` function takes an object and a list of keys,
 * and returns a new object containing only the specified keys.
 */
export default function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => (key in obj ? { ...acc, [key]: obj[key] } : acc),
    {} as Pick<T, K>,
  );
}
