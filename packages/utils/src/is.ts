export const isArray = <T>(arr: T) =>  Array.isArray(arr)
export const isBrowser = typeof window !== 'undefined';
export const isNavigator = typeof navigator !== 'undefined';
