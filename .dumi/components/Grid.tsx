import { Col, Row, type ColProps, type RowProps } from 'antd'
export default function DumiGrid({
  item = [],
  row,
}: {
  row?: RowProps
  item: { col?: ColProps & { children?: React.ReactNode } }[]
}) {
  return (
    <Row gutter={[20, 30]} {...row}>
      {item.map((item, index) => {
        return <Col key={index} span={12} {...item.col} />
      })}
    </Row>
  )
}
