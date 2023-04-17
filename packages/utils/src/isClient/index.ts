const isClient =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.matchMedia !== 'undefined';

export default isClient;
