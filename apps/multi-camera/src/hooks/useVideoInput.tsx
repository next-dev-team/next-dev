import React, { useCallback, useState } from 'react';
import { getDevices } from '../utils/video-inputs';

export default function useVideoInput() {
  const [devices, setDevices] = useState<MediaDeviceInfo[] | undefined>(
    undefined,
  );
  const handleSetDevices = useCallback((dv: MediaDeviceInfo[]) => {
    setDevices(dv);
  }, []);

  React.useEffect(() => {
    getDevices().then((resDevices) => handleSetDevices(resDevices));
  }, [handleSetDevices]);

  return [devices, setDevices] as const;
}
