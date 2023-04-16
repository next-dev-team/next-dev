export function truncate(input: string, length: number): string {
  if (length < 0 || typeof length !== 'number' || isNaN(length)) {
    throw new Error('Invalid length value');
  }
  if (length >= input.length) {
    return input;
  }
  return input.slice(0, length) + '...';
}

export const upperCase = (input: string): string => {
  return input.toUpperCase();
};

export const lowerFirst = (str: string): string => {
  if (!str) return str;
  return str[0].toLowerCase() + str.slice(1);
};

export const kebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

export function capitalize(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const camelCase = (str: string): string => {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * Converts a string to a slug format.
 *
 * @param {string} str The string to be converted.
 * @return {string} The slugified string.
 */
export function toSlug(str: string): string {
  if (!str) {
    return '';
  }

  const lowerCaseStr = str.toLowerCase().trim();
  const replacedSpaces = lowerCaseStr.replace(/ /g, '-');
  const replacedNonAlphanumeric = replacedSpaces.replace(/[^a-zA-Z0-9-]+/g, '');
  const replacedHyphens = replacedNonAlphanumeric.replace(/[-]+/g, '-');
  return replacedHyphens;
}
