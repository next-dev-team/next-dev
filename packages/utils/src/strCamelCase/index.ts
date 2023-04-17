const camelCase = (str: string): string => {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};
export default camelCase;
