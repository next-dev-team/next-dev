import { useEffect, useState } from 'react';

type UseDelayLoadingReturnType = [boolean, () => void];

export default function useDelayLoading(
  delayTimeMs = 300,
): UseDelayLoadingReturnType {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, delayTimeMs);

    return () => clearTimeout(timeoutId);
  }, [delayTimeMs]);

  return [isLoading, () => setIsLoading(false)];
}
