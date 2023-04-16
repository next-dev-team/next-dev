import { useEffect, useState } from 'react';

type UseDelayLoadingReturnType = [boolean, () => void];

export default function useDelayLoading(
  delayTimeMs = 300,
): UseDelayLoadingReturnType {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, delayTimeMs);
  };

  useEffect(() => {
    const timeoutId = startLoading();
    return () => clearTimeout(timeoutId as any);
  }, [delayTimeMs]);

  return [isLoading, startLoading];
}
