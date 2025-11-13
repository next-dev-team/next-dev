import React, { useState } from 'react';
import { Button, Card, Space, Statistic } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <Card title="Counter Demo" style={{ maxWidth: 400, margin: '20px auto' }}>
      <div style={{ textAlign: 'center' }}>
        <Statistic
          title="Current Count"
          value={count}
          style={{ marginBottom: 24 }}
        />
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={increment}
            size="large"
          >
            Increment
          </Button>
          <Button
            icon={<MinusOutlined />}
            onClick={decrement}
            size="large"
          >
            Decrement
          </Button>
          <Button
            danger
            onClick={reset}
            size="large"
          >
            Reset
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default Counter;