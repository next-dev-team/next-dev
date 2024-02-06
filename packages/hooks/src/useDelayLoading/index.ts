import { useEffect, useState } from 'react';

export default function useDelayLoading(delayTimeMs = 300) {
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    const id = setTimeout(() => {
      setIsLoading(false);
    }, delayTimeMs);
    setTimeoutId(id);
  };

  const stopLoading = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return [isLoading, { startLoading, stopLoading }] as const;
}
