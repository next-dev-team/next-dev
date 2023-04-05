const sum = (a: number, b: number): number => a + b;

describe('Testing OS Utlits', () => {
  it('Display the sum of 2 + 3', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
