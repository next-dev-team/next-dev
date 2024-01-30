import isObject from '../isObject';

/**
 * Converts the keys of an object to any case
 *
 * @param data - The data object or array to convert.
 * @param caseType - The type of case conversion to perform. Default is 'camelCase'.
 * @returns The converted object.
 */
export default function caseConversion<T extends Record<string, any> | any[]>(
  data: T,
  caseType: 'camelCase' | 'snakeCase' = 'camelCase',
): T {
  const convertedKeyMap: Record<string, (key: string) => string> = {
    camelCase: (key: string) =>
      key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase()),
    snakeCase: (key: string) =>
      key.replace(/([A-Z])/g, (match, p1) => `_${p1.toLowerCase()}`),
  };

  const convertKey = convertedKeyMap[caseType];
  const convertValue = (value: T) => caseConversion(value, caseType);

  if (Array.isArray(data)) return data.map((item) => convertValue(item)) as T;
  if (isObject(data)) {
    const keysValue = Object.entries(data);
    return keysValue.reduce((acc: any, [key, value]) => {
      const convertedKey = convertKey(key);
      acc[convertedKey] = convertValue(value);
      return acc;
    }, {});
  }
  return data;
}
