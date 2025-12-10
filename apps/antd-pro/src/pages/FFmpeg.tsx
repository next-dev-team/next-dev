import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Form, InputNumber, message, Progress, Select, Upload } from 'antd';
import { useState } from 'react';
import { getAuthHeaders } from '@/utils/auth';

type TranscodeResponse = { jobId: string };
type JobStatus = {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  outputUrl?: string;
  error?: string;
};

const API_BASE = 'http://localhost:43000';

export default function FFmpeg() {
  const [form] = Form.useForm();
  const [jobId, setJobId] = useState<string | null>(null);

  const transcodeMutation = useMutation({
    mutationFn: async (values: any): Promise<TranscodeResponse> => {
      const fileList = values.file ?? [];
      const file = fileList[0]?.originFileObj as File | undefined;
      if (!file) throw new Error('Please upload a media file');

      const fd = new FormData();
      fd.append('file', file);
      fd.append('operation', values.operation);
      fd.append('format', values.format);
      if (typeof values.bitrate === 'number') fd.append('bitrate', String(values.bitrate));
      if (typeof values.scale === 'number') fd.append('scale', String(values.scale));

      const authHeaders = getAuthHeaders() as Record<string, string>;
      const res = await fetch(`${API_BASE}/api/ffmpeg/transcode`, {
        method: 'POST',
        headers: authHeaders as HeadersInit,
        body: fd,
      });
      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(errTxt || 'Transcode request failed');
      }
      return (await res.json()) as TranscodeResponse;
    },
    onSuccess: (data) => {
      setJobId(data.jobId);
      message.success('Transcode job started');
    },
    onError: (err: any) => {
      message.error(err?.message ?? 'Failed to start job');
    },
  });

  const statusQuery = useQuery<JobStatus>({
    queryKey: ['ffmpeg-job', jobId],
    enabled: !!jobId,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      return status && status !== 'completed' && status !== 'failed' ? 2000 : false;
    },
    queryFn: async () => {
      if (!jobId) throw new Error('no job');
      const authHeaders = getAuthHeaders() as Record<string, string>;
      const res = await fetch(`${API_BASE}/api/ffmpeg/jobs/${jobId}`, {
        headers: authHeaders as HeadersInit,
      });
      if (!res.ok) throw new Error('Failed to fetch status');
      return (await res.json()) as JobStatus;
    },
  });

  const Dragger = Upload.Dragger as any;

  return (
    <PageContainer>
      <Card title="FFmpeg Transcoder" bordered>
        <Form form={form} layout="vertical" onFinish={(values) => transcodeMutation.mutate(values)}>
          <Form.Item name="file" label="Media file" valuePropName="fileList">
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
                { label: 'Extract Audio', value: 'extract-audio' },
              ]}
            />
          </Form.Item>

          <Form.Item name="format" label="Target format" rules={[{ required: true }]}>
            <Select
              placeholder="Select format"
              options={[
                { label: 'MP4 (H.264/AAC)', value: 'mp4' },
                { label: 'WebM (VP9/Opus)', value: 'webm' },
                { label: 'MP3 (Audio)', value: 'mp3' },
              ]}
            />
          </Form.Item>

          <Form.Item name="scale" label="Scale (width)" tooltip="e.g. 1920 for 1080p">
            <InputNumber min={240} max={3840} step={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="bitrate" label="Bitrate (kbps)">
            <InputNumber min={64} max={8000} step={32} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={transcodeMutation.isPending}>
              Start Transcode
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {jobId && (
        <Card title={`Job #${jobId}`} style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Progress percent={Math.round((statusQuery.data?.progress ?? 0) * 100)} />
            <div>Status: {statusQuery.data?.status ?? 'loading...'}</div>
          </div>
          {statusQuery.data?.outputUrl && (
            <div style={{ marginTop: 12 }}>
              Output:{' '}
              <a href={statusQuery.data.outputUrl} target="_blank" rel="noreferrer">
                Download
              </a>
            </div>
          )}
          {statusQuery.data?.error && (
            <div style={{ marginTop: 12, color: 'red' }}>Error: {statusQuery.data.error}</div>
          )}
        </Card>
      )}
    </PageContainer>
  );
}
