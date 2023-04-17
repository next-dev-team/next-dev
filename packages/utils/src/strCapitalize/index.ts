export default function capitalize(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
