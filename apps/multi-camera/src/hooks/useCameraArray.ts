import { useEffect, useMemo, useRef } from 'react';
import Webcam from 'react-webcam';
import useLocalStorage from './useLocalStorage';
import useUpdateEffect from './useUpdateEffect';
import useVideoInput from './useVideoInput';

const imgDate = new Date().getTime();

export default function useCameraArray() {
  const [devices] = useVideoInput();
  const [cameraArray, setCameraArray] = useLocalStorage('cameraArray', []);
  const [isCameraSetup, setIsCameraSetup] = useLocalStorage('isCameraSetup', false);


  const webcamRef1 = useRef<Webcam>(null);
  const webcamRef2 = useRef<Webcam>(null);
  const webcamRef3 = useRef<Webcam>(null);
  const webcamRef4 = useRef<Webcam>(null);

  // allow only devices with specific camera the same AI's training camera
  const getSelectDevice = useMemo(() => {

    const filterDevice = (devices?.filter((device) => !device.label.includes('FaceTime') && !device.label.includes('OBS') && !device.label.includes('HD UVC'), [devices]) || []) as MediaDeviceInfo[]
    return filterDevice

  }, [devices]);

  const cameras = [
    {
      ref: webcamRef1,
      file: `banker1_${imgDate}.jpeg`,
      deviceId: cameraArray?.[0]?.deviceId,
      label: cameraArray?.[0]?.label,
    },
    {
      ref: webcamRef2,

      file: `player1_${imgDate}.jpeg`,
      deviceId: cameraArray?.[1]?.deviceId,
      label: cameraArray?.[1]?.label,

    },
    {
      ref: webcamRef3,
      file: `player2_${imgDate}.jpeg`,
      deviceId: cameraArray?.[2]?.deviceId,
      label: cameraArray?.[2]?.label,

    },
    {
      file: `player3_${imgDate}.jpeg`,
      ref: webcamRef4,
      deviceId: cameraArray?.[3]?.deviceId,
      label: cameraArray?.[3]?.label,
    },

  ].filter((dv) => dv.deviceId);


  useEffect(() => {
    console.log('getSelectDevice', cameras);
  }, [getSelectDevice]);


  useUpdateEffect(() => {
    console.log('getSelectDevice', getSelectDevice);
    const isEqual = cameraArray.length === getSelectDevice?.length

    if (!isCameraSetup || !isEqual) {
      setCameraArray(getSelectDevice)
    }

  }, [getSelectDevice, isCameraSetup]);
  console.log('sss', cameras);


  return {
    isCameraSetup,
    setCameraArray,
    setIsCameraSetup,
    devices,
    cameras,
    getSelectDevice,
    cameraArray
  };
}
