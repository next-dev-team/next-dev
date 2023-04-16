import { act, renderHook } from '@testing-library/react-hooks';

import useDelayLoading from './';

describe('useDelayLoading', () => {
  it('should return initial loading state and a reset function', () => {
    const { result } = renderHook(() => useDelayLoading(300));

    expect(result.current[0]).toBe(true);
    expect(typeof result.current[1]).toBe('function');
  });

  it('should set loading to false after the specified delay time', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useDelayLoading(300),
    );

    expect(result.current[0]).toBe(true);

    await waitForNextUpdate();

    expect(result.current[0]).toBe(false);
  });

  it('should reset loading state when reset function is called', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useDelayLoading(300),
    );

    expect(result.current[0]).toBe(true);

    await waitForNextUpdate();

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
  });
});
