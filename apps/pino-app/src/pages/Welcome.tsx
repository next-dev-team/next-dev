import { PageContainer } from '@ant-design/pro-components';
import { Card, theme } from 'antd';
import type React from 'react';

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
          marginTop: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: '16px',
              color: token.colorTextHeading,
            }}
          >
            Posts
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
