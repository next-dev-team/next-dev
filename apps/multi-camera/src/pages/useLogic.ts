import { consFilter } from '@/constants';
import useKeyPress from '@/hooks/useKeyboard';
import useVideoInput from '@/hooks/useVideoInput';
import { useReactive } from 'ahooks';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import Webcam from 'react-webcam';

const imgDate = () => dayjs().format('DD-MM-YYYY hh:mm:ss a');
const captureImgName = (fileName = 'capture') => {
  return `${fileName}_${imgDate()}.jpg`.replace(/\s+/g, '_');
};
// const isShowPlayerCame = true;

// This function converts a base64 encoded string to a Blob object
function convertBase64ToBlob(base64: string) {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

export const useAppLogic = () => {
  const [devices = [], { showCamera }] = useVideoInput();
  const [showPageVal, setShowVal] = useState(8); // based antd grid
  const spacePress = useKeyPress([' ']);
  const state = useReactive({
    cameraType: consFilter.ALL,
    preview: true,
  });

  const isShowPlayerCame = state.preview;

  const webcamConfig = {
    audio: false,
    screenshotFormat: 'image/jpeg',
    screenshotQuality: 1,
    style: {
      position: isShowPlayerCame ? 'relative' : 'absolute',
      visibility: isShowPlayerCame ? 'visible' : 'hidden',
      width: '100%',
    },
  } as Webcam['props'];

  const filterDevice = useMemo(() => {
    const filterLabel =
      state.cameraType === consFilter.ALL ? [] : ['FaceTime HD Camera'];
    const isShowFace = state.cameraType === consFilter.FACE;

    return (
      devices
        ?.filter((device) =>
          isShowFace
            ? filterLabel.includes(device.label)
            : !filterLabel.includes(device.label),
        )
        ?.map(({ deviceId, label, kind }) => ({ deviceId, label, kind })) ?? []
    );
  }, [devices, state.cameraType]);

  const cameras = filterDevice.map((_, index) => ({
    ref: React.createRef<Webcam>(),
    file: `capture_${imgDate()}.jpeg`,
    deviceId: filterDevice[index]?.deviceId,
    label: filterDevice[index]?.label,
  }));

  const onCaptureBy = (ind: number, fileName: string) => {
    const capture = cameras[ind].ref?.current?.getScreenshot();
    if (capture) {
      const blob = convertBase64ToBlob(capture);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = captureImgName(
        ind.toString().padStart(2, '0') + '_' + fileName,
      );
      link.click();
    }
  };
  const onCapture = () => {
    const captureData = [];
    cameras?.forEach(async (_, ind) => {
      const getCapture = cameras[ind].ref?.current?.getScreenshot();

      function handleDownload() {
        const capture = cameras[ind].ref?.current?.getScreenshot();
        if (capture) {
          const blob = convertBase64ToBlob(capture);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = captureImgName(
            ind.toString().padStart(2, '0') + '_' + _.label,
          );
          link.click();
        }
      }
      if (getCapture) {
        captureData.push(getCapture);
        handleDownload();
      }
    });

    console.log('captureData', captureData.length);
  };

  const maxNumber = 24;
  const options = Array.from({ length: 4 }, (_, i) => ({
    label: i + 1,
    value: Math.ceil(maxNumber / (i + 1)),
  }));

  useEffect(() => {
    async function requestCameraPermission() {
      try {
        const isAccess = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        console.log('Camera permission granted', isAccess);
      } catch (error) {
        console.log('Camera permission denied:', error);
      }
    }
    requestCameraPermission();
  }, []);

  useEffect(() => {
    if (spacePress.keyPressed) {
      onCapture();
    }
  }, [spacePress.keyPressed]);

  useEffect(() => {
    console.log('log', { spacePress, filterDevice });
  }, [spacePress, filterDevice]);

  return {
    state,
    onCaptureBy,
    setShowVal,
    showCamera,
    showPageVal,
    options,
    onCapture,
    cameras,
    webcamConfig,
  };
};
