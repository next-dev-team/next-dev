import { ProCard } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Empty,
  Form,
  Result,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import Webcam from 'react-webcam';
import { AppFilter } from './components/filter';
import { useAppLogic } from './useLogic';

export default function HomePage() {
  const {
    showCamera,
    options,
    onCapture,
    cameras,
    webcamConfig,
    state,
    onCaptureBy,
    showPageVal,
    setShowVal,
  } = useAppLogic();

  const renderEmpty = <Empty />;

  const renderToggle = (
    <Switch
      checkedChildren="Preview"
      unCheckedChildren="Preview"
      checked={state.preview}
      onChange={(toggle) => (state.preview = toggle)}
    />
  );

  const renderFiler = (
    <Space align="baseline" style={{ marginTop: 20 }}>
      <AppFilter
        defaultValue={state.cameraType}
        onChange={(e) => (state.cameraType = e.target.value)}
      />

      {renderToggle}
      <Form layout="horizontal">
        <Form.Item initialValue={showPageVal} label="Show/row" name="show">
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
  );

  const renderNoPreview = (
    <Result
      status="warning"
      title="The camera preview feature is currently turned off"
      extra={renderToggle}
    />
  );

  const renderCameraPreview = (
    <>
      <Row wrap gutter={[10, 10]}>
        {cameras.map((came, index) => {
          return (
            <Col span={showPageVal} key={index}>
              {state.preview && (
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
              )}
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

      {!state.preview && renderNoPreview}
    </>
  );

  const renderCardContent = () => {
    if (cameras?.length > 0) return renderCameraPreview;
    return renderEmpty;
  };

  return (
    <div style={{ maxWidth: '98%', margin: 'auto' }}>
      <ProCard
        bordered
        headerBordered
        size="small"
        loading={showCamera}
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            Multiple camera capture
          </Typography.Title>
        }
        subTitle="(Press capture/space to capture)"
        extra={renderFiler}
      >
        {renderCardContent()}
      </ProCard>
    </div>
  );
}
