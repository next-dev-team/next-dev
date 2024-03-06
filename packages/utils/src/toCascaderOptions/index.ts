import caseConversion from '../caseConversion'

interface Option {
  value: string | number
  label: string
  children?: Option[]
}

function toCascaderOptions(apiResponse: any): Option[] {
  if (!apiResponse) return []

  return Object.entries(apiResponse).map(([key, colValue]) => {
    if (Array.isArray(colValue)) {
      return {
        value: key,
        label: caseConversion(key, 'camelToCapitalWord'),
        children: toCascaderOptions(colValue[0]),
      }
    } else if (typeof colValue === 'object') {
      return {
        value: key,
        label: caseConversion(key, 'camelToCapitalWord'),
        children: toCascaderOptions(colValue),
      }
    }

    return {
      value: key,
      label: caseConversion(key, 'camelToCapitalWord'),
    }
  }) as Option[]
}

export default toCascaderOptions
