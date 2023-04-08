import useKeyPress from '@/hooks/useKeyboard';
import useVideoInput from '@/hooks/useVideoInput';
import { Button, Card, Col, Form, Row, Select, Space } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import Webcam from 'react-webcam';
const imgDate = new Date().getTime();

const isShowPlayerCame = true;

export default function HomePage() {
  const [devices] = useVideoInput();
  const [showPageVal, setShowVal] = useState(12);
  const spacePress = useKeyPress([' ']);

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
      width: '100%',
    },
  } as Webcam['props'];

  // allow only devices with specific camera the same AI's training camera
  const filterDevice = useMemo(() => {
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
      deviceId: filterDevice[0]?.deviceId,
      label: filterDevice[0]?.label,
    },
    {
      ref: webcamRef2,

      file: `player1_${imgDate}.jpeg`,
      deviceId: filterDevice[1]?.deviceId,
      label: filterDevice[1]?.label,
    },
    {
      ref: webcamRef3,
      file: `player2_${imgDate}.jpeg`,
      deviceId: filterDevice[2]?.deviceId,
      label: filterDevice[2]?.label,
    },
    {
      file: `player3_${imgDate}.jpeg`,
      ref: webcamRef4,
      deviceId: filterDevice[3]?.deviceId,
      label: filterDevice[3]?.label,
    },
  ].filter((dv) => dv.deviceId);

  const onCapture = () => {
    const captureData = [];
    cameras?.forEach(async (_, ind) => {
      const getCapture = cameras[ind].ref?.current?.getScreenshot();

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
        if (isAccess?.active) {
          // location.reload();
        }
      } catch (error) {
        console.log('Camera permission denied:', error);
      }
    }
    requestCameraPermission();
  }, []);

  useEffect(() => {
    console.log('spacePress', spacePress);

    if (spacePress.keyPressed) {
      onCapture();
    }
  }, [spacePress.keyPressed]);

  return (
    <div style={{ maxWidth: '80%', margin: 'auto' }}>
      <Card
        title="Multiple camera capture"
        extra={
          <Space align="baseline" style={{ marginTop: 20 }}>
            <Form layout="horizontal">
              <Form.Item
                initialValue={showPageVal}
                label="Show/row"
                name="show"
              >
                <Select
                  onSelect={(e) => {
                    console.log(e);
                    setShowVal(e);
                  }}
                  options={options}
                  style={{ width: '120px' }}
                />
              </Form.Item>
            </Form>
            <Button type="primary" onClick={onCapture}>
              Capture
            </Button>
          </Space>
        }
      >
        <Row wrap gutter={[10, 10]}>
          {cameras.map((came, index) => {
            return (
              <Col span={showPageVal} key={index}>
                <Webcam
                  ref={came.ref}
                  {...webcamConfig}
                  videoConstraints={{
                    deviceId: came.deviceId,
                  }}
                />
              </Col>
            );
          })}
        </Row>
      </Card>
    </div>
  );
}
