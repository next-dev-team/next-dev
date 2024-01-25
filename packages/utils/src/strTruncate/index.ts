export default function truncate(input: string, length: number): string {
  if (length < 0 || typeof length !== 'number' || isNaN(length)) {
    throw new Error('Invalid length value');
  }
  if (length >= input.length) return input;

  return input.slice(0, length) + '...';
}
