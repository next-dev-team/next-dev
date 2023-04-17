import asyncSleep from '.';

// --------------------------- asyncSleep ------------------------------
describe('asyncSleep', () => {
  test('resolves after the specified number of milliseconds', async () => {
    const startTime = Date.now();
    await asyncSleep(100); // Wait for 100 milliseconds
    const endTime = Date.now();
    const elapsed = endTime - startTime;
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });

  test('resolves with the provided mock value', async () => {
    const mockValue = { foo: 'bar' };
    const result = await asyncSleep(100, mockValue); // Wait for 100 milliseconds with a mock value
    expect(result).toEqual(mockValue); // Ensure that the resolved value is equal to the mock value
  });
});
