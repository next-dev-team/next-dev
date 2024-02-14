import { ProColumns } from '@ant-design/pro-components'
import Crud from '.'

const dataSource = [
  {
    id: 1,
    name: 'John Brown',
    age: 32,
  },
]

export default function Demo() {
  const columns: ProColumns<any>[] = [
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
  ]
  return (
    <>
      <Crud columns={columns} dataSource={dataSource} />
    </>
  )
}
