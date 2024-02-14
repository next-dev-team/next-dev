import { ConfigProvider } from 'antd'
import { useOutlet } from 'dumi'
import React, { type FC } from 'react'

const GlobalLayout: FC = () => {
  const outlet = useOutlet()

  return <ConfigProvider>{outlet}</ConfigProvider>
}

export default GlobalLayout
