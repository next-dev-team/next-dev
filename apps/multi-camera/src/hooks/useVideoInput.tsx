import { Modal, Space } from 'antd';
import Link from 'antd/es/typography/Link';
import { useCallback, useEffect, useState } from 'react';
import { getDevices } from '../utils/video-inputs';

export default function useVideoInput() {
  const [devices, setDevices] = useState<MediaDeviceInfo[] | undefined>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleSetDevices = useCallback((dv: MediaDeviceInfo[]) => {
    setDevices(dv);
  }, []);

  useEffect(() => {
    setShowCamera(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setPermissionGranted(true);
        getDevices().then((resDevices) => handleSetDevices(resDevices));
        setShowCamera(false);
      })
      .catch(() => {
        setPermissionGranted(false);
        setDevices([]);
        handlePermission();
        setShowCamera(false);
      });

    navigator.mediaDevices.addEventListener('devicechange', (event) => {
      getDevices().then((resDevices) => handleSetDevices(resDevices));
    });

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', () => {});
    };
  }, [handleSetDevices]);

  const handlePermission = () =>
    Modal.confirm({
      title: 'Permission Required',
      content: (
        <Space>
          Please allow access permissions
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={'https://support.google.com/chrome/answer/2693767'}
          >
            Learn more
          </Link>
        </Space>
      ),
      onOk: () => location.reload(),
      okText: 'Reload permissions',
      cancelButtonProps: { hidden: true, disabled: true },
    });

  return [devices, { setDevices, permissionGranted, showCamera }] as const;
}
