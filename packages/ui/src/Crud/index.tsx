import { ProTable } from '@ant-design/pro-components';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 64,
    hideInForm: true,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    formItemProps: {
      rules: [{ required: true }],
    },
  },
];

export default function Crud() {
  return (
    <ProTable
      id="data-table"
      search={{
        labelWidth: 'auto',
      }}
      columns={columns}
      options={{
        fullScreen: true,
        setting: { draggable: true },
      }}
      scroll={{ x: true }}
      rowKey="id"
      dateFormatter="string"
      headerTitle="Data Table"
    />
  );
}
