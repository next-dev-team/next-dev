/**
 * Simple hello utility function
 * @param name - Name to greet (optional)
 * @returns Greeting message
 */
export function hello(name?: string): string {
  if (name) {
    return `Hello, ${name}! 👋`;
  }
  return 'Hello, World! 👋';
}

/**
 * Async hello utility function
 * @param name - Name to greet (optional)
 * @returns Promise resolving to greeting message
 */
export async function helloAsync(name?: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(hello(name));
    }, 100);
  });
}
