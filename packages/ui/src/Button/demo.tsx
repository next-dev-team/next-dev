import { Space } from 'antd'
import Button from '.'

export default function Demo() {
  return (
    <Space>
      <Button>Default </Button>
      <Button type="primary">Primary </Button>
      <Button type="primary" danger>
        Primary danger1
      </Button>
    </Space>
  )
}
