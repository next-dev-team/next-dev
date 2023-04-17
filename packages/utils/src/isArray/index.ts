const isArray = <T>(arr: unknown): arr is T[] => Array.isArray(arr);
export default isArray;
