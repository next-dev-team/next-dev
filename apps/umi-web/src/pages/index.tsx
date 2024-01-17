import { useReactive } from '@next-dev/hooks';
import { Button } from '@next-dev/ui';
import { isArray, isBoolean, strUpperCase } from '@next-dev/utils';

export default function Test() {
  const state = useReactive({ count: 0 });
  const { count } = state;

  const inc = () => {
    state.count++;
  };

  const testUtil = {
    isBoolean: isBoolean(true),
    isArray: isArray('[]'),
    strUpperCase: strUpperCase('test'),
  };

  console.log('=====>', { count, testUtil });
  return (
    <Button onClick={inc} type="primary">
      Count {count}
    </Button>
  );
}
