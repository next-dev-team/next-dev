import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormList,
  ProFormText,
} from '@ant-design/pro-components';
import { Crud } from '@next-dev/ui';
import { Button, Form, Space, message } from 'antd';
import axios from 'axios';
import { useRef } from 'react';
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const API_TOKEN =
  '0b4c0fa225e4e432de7e51fe13691e86e27ac12a360ca251bf714eeb00942325';

const axiosInstance = axios.create({
  baseURL: 'https://gorest.co.in/public/v1',
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export default () => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const actionRef = useRef<ActionType>(null);
  const ref = useRef<ProFormInstance>();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true }],
      },
    },
  ];

  return (
    <Space direction="vertical">
      <ModalForm<{
        name: string;
        company: string;
      }>
        title="新建表单"
        trigger={
          <Button type="primary">
            <PlusOutlined />
            CRUD Generator
          </Button>
        }
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          await waitTime(2000);
          console.log(values.name);
          message.success('提交成功');
          return true;
        }}
      >
        <ProFormText
          style={{ padding: 0 }}
          width="md"
          name="name"
          label="规格名"
        />
        <ProFormList
          name="attributes"
          label="规格"
          creatorButtonProps={{
            creatorButtonText: '添加规格项',
          }}
          min={1}
          copyIconProps={false}
          itemRender={({ listDom, action }, { index }) => (
            <ProCard
              bordered
              style={{ marginBlockEnd: 8 }}
              title={`规格${index + 1}`}
              extra={action}
              bodyStyle={{ paddingBlockEnd: 0 }}
            >
              {listDom}
            </ProCard>
          )}
          creatorRecord={{ name: '', items: [{ name: '' }] }}
          initialValue={[
            { name: '颜色', items: [{ name: '红' }, { name: '黄' }] },
          ]}
        >
          <ProFormText
            style={{ padding: 0 }}
            width="md"
            name="name"
            label="Data Source"
          />
          <ProForm.Item
            isListField
            style={{ marginBlockEnd: 0 }}
            label="规格值"
          >
            <ProFormList
              name="items"
              creatorButtonProps={{
                creatorButtonText: '新建',
                icon: false,
                type: 'link',
                style: { width: 'unset' },
              }}
              min={1}
              copyIconProps={false}
              deleteIconProps={{ tooltipText: '删除' }}
              itemRender={({ listDom, action }) => (
                <div
                  style={{
                    display: 'inline-flex',
                    marginInlineEnd: 25,
                  }}
                >
                  {listDom}
                  {action}
                </div>
              )}
            >
              <ProFormText allowClear={false} width="xs" name={['name']} />
            </ProFormList>
          </ProForm.Item>
        </ProFormList>
      </ModalForm>
      <Crud
        listProps={{
          listReqOpt: ({ current, pageSize, ...rest }) => ({
            url: '/users',
            params: {
              ...rest,
              per_page: pageSize,
              page: current,
            },
          }),
          deleteReqOpt: (row) => ({ url: `/users/${row.id}` }),
          dataField: ['data', 'data'],
          totalItemField: ['data', 'meta', 'pagination', 'total'],
          totalPageField: ['data', 'meta', 'pagination', 'pages'],
        }}
        headerTitle="Auto CRUD"
        formRef={ref}
        axios={axiosInstance}
        columns={columns as any}
        actionRef={actionRef}
      />
    </Space>
  );
};
