import { Button, Card, Typography } from '@next-dev/ui';
import { isArray, isBoolean, strUpperCase } from '@next-dev/utils';
import { request, useRequest } from '@umijs/max';

const service = async () => {
  try {
    const response = await request(
      'http://localhost:7001/bar/user?userId=test',
    );
    const data = await response;
    return { data };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { data: 'Error fetching data' };
  }
};

export default function Test() {
  const { data, loading } = useRequest(service);
  // const state = useReactive({ count: 0 });
  // const { count } = state;

  const inc = () => {
    // state.count++;
  };

  const testUtil = {
    isBoolean: isBoolean(true),
    isArray: isArray('[]'),
    strUpperCase: strUpperCase('test'),
  };

  console.log('=====>', { testUtil, data });
  return (
    <Card loading={loading}>
      <Typography.Text>{data}</Typography.Text>
      <Button onClick={inc} type="primary">
        Count
      </Button>
    </Card>
  );
}
