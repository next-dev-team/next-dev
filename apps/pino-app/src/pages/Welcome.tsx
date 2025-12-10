import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, theme } from 'antd';
import type React from 'react';

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
          marginTop: 16,
          background: 'red',
        }}
      >
        <Button>test</Button>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
