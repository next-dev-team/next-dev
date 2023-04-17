import { AnyObject } from '..';

export default function omit<T extends AnyObject>(
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
