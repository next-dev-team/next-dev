/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useEffect } from 'react';
import { useFirstMountState } from './useFirstMountState';

/**
 *
 * @param effect
 * @param deps
 * @see https://github.com/streamich/react-use/blob/master/docs/useUpdateEffect.md
 *
 */
const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;
