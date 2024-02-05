import { useEffect, useState } from 'react';

export default function useDelayLoading(delayTimeMs = 300) {
  const [isLoading, setIsLoading] = useState(true);

  const startLoading = () => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, delayTimeMs);
    return timeoutId;
  };
  const stopLoading = () => setIsLoading(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isLoading) {
      timeoutId = startLoading();
    }
    return () => {
      clearTimeout(timeoutId as any);
    };
  }, [delayTimeMs, isLoading]);

  return [isLoading, { startLoading, stopLoading }] as const;
}
