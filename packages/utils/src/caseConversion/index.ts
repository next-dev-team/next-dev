import isObject from '../isObject'

const convertedKeyMap = {
  camelCase: (key: string) => key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase()),
  snakeCase: (key: string) => key.replace(/([A-Z])/g, (match, p1) => `_${p1.toLowerCase()}`),
  camelToCapitalWord: (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  },
} as const
/**
 * Converts the keys of an object to any case
 *
 * @param data - The data object or array to convert.
 * @param caseType - The type of case conversion to perform. Default is 'camelCase'.
 * @returns The converted object.
 */
export default function caseConversion<T extends unknown>(
  data: T,
  caseType: keyof typeof convertedKeyMap = 'camelCase'
): T {
  const convertKey = convertedKeyMap?.[caseType]
  if (!convertKey) {
    throw new Error(`Unsupported case type: ${caseType}`)
  }
  const convertValue = (value: T) => caseConversion(value, caseType)

  if (Array.isArray(data)) return data.map((item) => convertValue(item)) as T
  if (isObject(data)) {
    const keysValue = Object.entries(data)
    return keysValue.reduce((acc: any, [key, value]) => {
      const convertedKey = convertKey(key)
      acc[convertedKey] = convertValue(value)
      return acc
    }, {})
  }
  if (typeof data === 'string') return convertKey(data) as T
  return data
}
