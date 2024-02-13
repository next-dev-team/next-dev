import { PlusOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import { Button } from 'antd'

export type Crud<TData extends Record<string, any>> = {} & React.ComponentProps<
  typeof ProTable<TData>
>

export default function Crud<TData extends Record<string, any>>(props: Crud<TData>) {
  const { ...rest } = props
  return (
    <ProTable
      id="data-table"
      {...rest}
      search={{
        labelWidth: 'auto',
      }}
      options={{
        fullScreen: true,
        setting: { draggable: true },
      }}
      scroll={{ x: true }}
      rowKey="id"
      dateFormatter="string"
      headerTitle="Data Table"
      toolBarRender={() =>
        [
          <Button key={'crud'} type="primary" icon={<PlusOutlined />}>
            Add
          </Button>,
        ].filter(Boolean)
      }
    />
  )
}
