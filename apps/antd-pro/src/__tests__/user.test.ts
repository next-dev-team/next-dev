import { describe, it, expect, vi } from 'vitest';
import { createUser } from '@/api/petstore/user/user';

vi.mock('@/api/mutator/umi-request', () => ({
  customRequest: vi.fn(async (config: any) => {
    expect(config.url).toContain('/v2/user');
    expect(config.method).toBe('POST');
    return undefined;
  }),
}));

describe('createUser', () => {
  it('posts to /user', async () => {
    await expect(
      createUser({ username: 'demo', firstName: 'Demo' } as any)
    ).resolves.toBeUndefined();
  });
});