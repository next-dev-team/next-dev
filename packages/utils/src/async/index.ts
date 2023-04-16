/**
 * Asynchronously waits for the specified number of milliseconds, then resolves with the provided mock value (if any).
 * @example
 * // Wait for 1 second, then log "Hello, world!" to the console
 * async function exampleUsage() {
 *   const result = await asyncSleep(1000, "Hello, world!");
 *   console.log(result); // "Hello, world!"
 * }
 */
export async function asyncSleep<T>(
  ms: number,
  mockValue?: T,
): Promise<unknown> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return Promise.resolve(mockValue);
}
