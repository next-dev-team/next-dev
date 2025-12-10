import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { usePostApiConvert, usePostApiExtract } from '@rnr/api-ffmpeg/src/gen/hooks';
import { Button, Card, Form, InputNumber, message, Select, Upload } from 'antd';
import { useState } from 'react';
import { getAuthHeaders } from '@/utils/auth';

type ConvertResponse = { success?: boolean; data?: { url?: string }[] };
type ExtractResponse = { success?: boolean; data?: object[] };

export default function FFmpeg() {
  const [form] = Form.useForm();
  const [convertResult, setConvertResult] = useState<ConvertResponse | null>(null);
  const [extractResult, setExtractResult] = useState<ExtractResponse | null>(null);

  const convertMutation = usePostApiConvert({
    client: { headers: getAuthHeaders() as Record<string, string> },
    mutation: {
      onSuccess: (data: ConvertResponse) => {
        setConvertResult(data);
        message.success('Converted');
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.error ?? 'Convert failed');
      },
    },
  });

  const extractMutation = usePostApiExtract({
    client: { headers: getAuthHeaders() as Record<string, string> },
    mutation: {
      onSuccess: (data: ExtractResponse) => {
        setExtractResult(data);
        message.success('Extracted');
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.error ?? 'Extract failed');
      },
    },
  });

  const handleSubmit = (values: any) => {
    const files = (values.file ?? []) as { originFileObj?: Blob }[];
    const blobs = files.map((f) => f.originFileObj).filter(Boolean) as Blob[];
    if (!blobs.length) {
      message.error('Please upload a media file');
      return;
    }
    if (values.operation === 'convert') {
      convertMutation.mutate({ data: { video: blobs, format: values.format } });
    } else {
      const interval = values.interval != null ? Number(values.interval) : undefined;
      extractMutation.mutate({ data: { video: blobs, interval } });
    }
  };

  const Dragger = Upload.Dragger as any;
  const normFile = (e: any) => (Array.isArray(e) ? e : (e?.fileList ?? []));

  return (
    <PageContainer>
      <Card title="FFmpeg Transcoder">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="file"
            label="Media file"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Dragger
              multiple={false}
              beforeUpload={() => false}
              maxCount={1}
              accept="video/*,audio/*"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single upload. Video and audio files.</p>
            </Dragger>
          </Form.Item>

          <Form.Item name="operation" label="Operation" rules={[{ required: true }]}>
            <Select
              placeholder="Select operation"
              options={[
                { label: 'Convert Video', value: 'convert' },
                { label: 'Extract Image', value: 'extract-image' },
              ]}
            />
          </Form.Item>

          <Form.Item name="format" label="Target format" rules={[{ required: true }]}>
            <Select
              placeholder="Select format"
              options={[
                { label: 'MP4 (H.264/AAC)', value: 'mp4' },
                { label: 'WebM (VP9/Opus)', value: 'webm' },
                { label: 'Thumbnail', value: 'image' },
              ]}
            />
          </Form.Item>

          <Form.Item name="interval" label="Interval (seconds)">
            <InputNumber min={1} max={60} step={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={convertMutation.isPending || extractMutation.isPending}
            >
              Start Transcode
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {(convertResult?.data?.length ?? 0) > 0 && (
        <Card title="Converted files" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(convertResult?.data ?? []).map((item, idx) => (
              <a
                key={item.url ?? `converted-${idx}`}
                href={item.url ?? '#'}
                target="_blank"
                rel="noreferrer"
              >
                {item.url ?? 'File'}
              </a>
            ))}
          </div>
        </Card>
      )}
      {(extractResult?.data?.length ?? 0) > 0 && (
        <Card title="Extracted output" style={{ marginTop: 16 }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(extractResult?.data, null, 2)}
          </pre>
        </Card>
      )}
    </PageContainer>
  );
}
