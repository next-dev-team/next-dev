import useVideoInput from '@/hooks/useVideoInput';
import { Button, Card } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import Webcam from 'react-webcam';
const fs = require('fs');
const imgDate = new Date().getTime();

const isShowPlayerCame = true;

export default function HomePage() {
  const [devices] = useVideoInput();

  const webcamRef1 = useRef<Webcam>(null);
  const webcamRef2 = useRef<Webcam>(null);
  const webcamRef3 = useRef<Webcam>(null);
  const webcamRef4 = useRef<Webcam>(null);

  const webcamConfig = {
    audio: false,
    screenshotFormat: 'image/jpeg',
    screenshotQuality: 1,
    style: {
      position: isShowPlayerCame ? 'relative' : 'absolute',
      visibility: isShowPlayerCame ? 'visible' : 'hidden',
      width: 700,
    },
  } as Webcam['props'];

  // allow only devices with specific camera the same AI's training camera
  const getSelectDevice = useMemo(() => {
    const filterDevice = (devices?.filter(
      (device) =>
        !device.label.includes('FaceTime') &&
        !device.label.includes('OBS') &&
        !device.label.includes('HD UVC'),
      [devices],
    ) || []) as MediaDeviceInfo[];
    return filterDevice;
  }, [devices]);

  const cameras = [
    {
      ref: webcamRef1,
      file: `banker1_${imgDate}.jpeg`,
      deviceId: getSelectDevice?.[0]?.deviceId,
      label: getSelectDevice?.[0]?.label,
    },
    {
      ref: webcamRef2,

      file: `player1_${imgDate}.jpeg`,
      deviceId: getSelectDevice?.[1]?.deviceId,
      label: getSelectDevice?.[1]?.label,
    },
    {
      ref: webcamRef3,
      file: `player2_${imgDate}.jpeg`,
      deviceId: getSelectDevice?.[2]?.deviceId,
      label: getSelectDevice?.[2]?.label,
    },
    {
      file: `player3_${imgDate}.jpeg`,
      ref: webcamRef4,
      deviceId: getSelectDevice?.[3]?.deviceId,
      label: getSelectDevice?.[3]?.label,
    },
  ].filter((dv) => dv.deviceId);

  useEffect(() => {
    console.log('getSelectDevice', cameras);
  }, [getSelectDevice]);

  function downloadBase64(uri, filename) {
    const link = document.createElement('a');
    link.href = uri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const onCapture = () => {
    const captureData = [];
    cameras?.forEach(async (_, ind) => {
      const getCapture = cameras[ind].ref?.current?.getScreenshot();

      // This function converts a base64 encoded string to a Blob object
      function convertBase64ToBlob(base64) {
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
      function handleDownload() {
        const capture = cameras[ind].ref?.current?.getScreenshot();
        if (capture) {
          const blob = convertBase64ToBlob(capture);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'dealer-card.jpg';
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

  return (
    <div style={{ maxWidth: '70%', margin: 'auto' }}>
      <Card
        title="Multiple camera capture"
        extra={<Button onClick={onCapture}>Capture</Button>}
      >
        {cameras.map((came, index) => {
          return (
            <Webcam
              key={index}
              ref={came.ref}
              {...webcamConfig}
              videoConstraints={{
                deviceId: came.deviceId,
              }}
            />
          );
        })}
      </Card>
    </div>
  );
}
