import { Space } from 'antd'
import Button from '.'

export default function Demo() {
  return (
    <Space>
      <Button>Default </Button>
      <Button type="primary">Primary </Button>
      <Button type="primary" danger>
        Danger
      </Button>
    </Space>
  )
}
