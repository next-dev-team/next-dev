import { Button, Space, Spin } from 'antd';
import useDelayLoading from '.';

export default function Demo() {
  const [loading, { startLoading, stopLoading }] = useDelayLoading(10000);
  return (
    <Space size="large">
      <Button disabled={loading} type="primary" onClick={startLoading}>
        Start
      </Button>
      {loading ? <Spin size="large" spinning /> : 'Loading complete'}
      <Button danger onClick={stopLoading}>
        Stop
      </Button>
    </Space>
  );
}
