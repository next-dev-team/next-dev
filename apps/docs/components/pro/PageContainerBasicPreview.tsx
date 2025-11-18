'use client'

import { PageContainer } from '@rnr/rnr-ui'
import { View, Text } from 'react-native'
import { Button } from '@docs/components/ui/button'

export function PageContainerBasicPreview() {
  return (
    <View style={{ width: '100%' }}>
      <PageContainer
        title="Orders"
        subTitle="Daily orders overview"
        extra={<Button>Export</Button>}
        breadcrumb={{ routes: [
          { path: '/', breadcrumbName: 'Home' },
          { path: '/orders', breadcrumbName: 'Orders' },
          { path: '/orders/today', breadcrumbName: 'Today' },
        ]}}
        tabList={[
          { key: 'today', tab: <Text>Today</Text> },
          { key: 'week', tab: <Text>This Week</Text> },
        ]}
        content={<Text style={{ color: '#666' }}>Quick insights and actions</Text>}
        waterMarkProps={{ content: 'company', rotate: -20, opacity: 0.15 }}
        footer={<Text>Total 120 orders</Text>}
      >
        <View style={{ padding: 16 }}>
          <Text>Charts and tables</Text>
        </View>
      </PageContainer>
    </View>
  )
}