import { Button, Card, Col, Form, Row, Select, Space } from 'antd';
import Webcam from 'react-webcam';
import { AppFilter } from './components/filter';
import { useAppLogic } from './useLogic';

export default function HomePage() {
  const {
    setShowVal,
    showCamera,
    showPageVal,
    options,
    onCapture,
    cameras,
    webcamConfig,
    state,
    onCaptureBy,
  } = useAppLogic();

  return (
    <div style={{ maxWidth: '80%', margin: 'auto' }}>
      <Card
        loading={showCamera}
        title="Multiple camera capture"
        extra={
          <Space align="baseline" style={{ marginTop: 20 }}>
            <AppFilter
              defaultValue={state.cameraType}
              onChange={(e) => (state.cameraType = e.target.value)}
            />
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
            <Button danger type="primary" onClick={onCapture}>
              Capture All
            </Button>
          </Space>
        }
      >
        <Row wrap gutter={[10, 10]}>
          {cameras.map((came, index) => {
            return (
              <Col span={showPageVal} key={index}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                    alignItems: 'center',
                  }}
                >
                  {`${came.label} (${came.deviceId.slice(0, 12)}...)`}
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => onCaptureBy(index, came.label)}
                  >
                    Capture
                  </Button>
                </div>
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
