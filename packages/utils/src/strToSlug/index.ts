/**
 * Converts a string to a slug format.
 *
 * @param {string} str The string to be converted.
 * @return {string} The slugified string.
 */
export default function toSlug(str: string): string {
  if (!str) {
    return '';
  }

  const lowerCaseStr = str.toLowerCase().trim();
  const replacedSpaces = lowerCaseStr.replace(/ /g, '-');
  const replacedNonAlphanumeric = replacedSpaces.replace(/[^a-zA-Z0-9-]+/g, '');
  const replacedHyphens = replacedNonAlphanumeric.replace(/[-]+/g, '-');
  return replacedHyphens;
}
