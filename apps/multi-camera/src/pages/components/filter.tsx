import { consFilter } from '@/constants';
import { Radio, RadioGroupProps } from 'antd';

export const AppFilter = ({ ...rest }: RadioGroupProps) => {
  return (
    <Radio.Group
      optionType="button"
      defaultValue={consFilter.ALL}
      options={[
        {
          label: 'All',
          value: consFilter.ALL,
        },
        {
          label: 'Face camera',
          value: consFilter.FACE,
        },
        {
          label: 'External Camera',
          value: consFilter.OTHER_CAMERA,
        },
      ]}
      {...rest}
    />
  );
};
