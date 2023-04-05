import { info, log } from './logger';

const getVideoInputs = (devices: any[]): any[] => devices.reduce((carry: any[], device: any) => {
  const { kind } = device;
  return kind === 'videoinput'
    ? [...carry, device]
    : carry;
}, []);

export const getDevices = (hide = false): Promise<MediaDeviceInfo[]> => {
  try {
    return navigator
      .mediaDevices
      .enumerateDevices()
      .then(getVideoInputs)
      .then((devices) => {
        info({ message: devices, title: 'getVideoInputs', hide });
        return devices;
      });
  } catch (error: any) {
    log({ type: 'error', message: 'mediaDevices', title: 'mediaDevices' });
    return error;
  }
};

export const test = '';
