const getVideoInputs = (devices: any[]): any[] =>
  devices.reduce((carry: any[], device: any) => {
    const { kind } = device;
    return kind === 'videoinput' ? [...carry, device] : carry;
  }, []);

export const getDevices = (hide = false): Promise<MediaDeviceInfo[]> => {
  try {
    return navigator.mediaDevices
      .enumerateDevices()
      .then(getVideoInputs)
      .then((devices) => {
        return devices;
      });
  } catch (error: any) {
    return error;
  }
};

export const test = '';
