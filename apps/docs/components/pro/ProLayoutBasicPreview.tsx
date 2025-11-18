'use client'

import { ProLayout, PageContainer } from '@rnr/rnr-ui'
import type { RouteItem } from '@rnr/rnr-ui'
import { View, Text } from 'react-native'
import { Button } from '@docs/components/ui/button'

const route: RouteItem = {
  routes: [
    { path: '/dashboard', name: 'Dashboard' },
    {
      path: '/users',
      name: 'Users',
      routes: [
        { path: '/users/list', name: 'List' },
        { path: '/users/create', name: 'Create' },
      ],
    },
    { path: '/settings', name: 'Settings' },
  ],
}

export function ProLayoutBasicPreview() {
  return (
    <View style={{ height: 600, width: '100%' }}>
      <ProLayout
        title="Admin"
        route={route}
        layout="mix"
        navTheme="dark"
        fixSiderbar
        fixedHeader
        headerContentRender={() => (
          <Button size="sm">New</Button>
        )}
        rightContentRender={() => <Text style={{ fontSize: 12 }}>User</Text>}
        location={{ pathname: '/users/list' }}
      >
        <PageContainer
          title="Users"
          subTitle="Manage system users"
          extra={<Button>Add User</Button>}
          breadcrumb={{ routes: [
            { path: '/', breadcrumbName: 'Home' },
            { path: '/users', breadcrumbName: 'Users' },
            { path: '/users/list', breadcrumbName: 'List' },
          ]}}
          tabList={[
            { key: 'list', tab: <Text>List</Text> },
            { key: 'activity', tab: <Text>Activity</Text> },
          ]}
          content={<Text style={{ color: '#666' }}>Use actions for page operations</Text>}
          waterMarkProps={{ content: 'internal', opacity: 0.2 }}
        >
          <View style={{ padding: 16 }}>
            <Text>Page body</Text>
          </View>
        </PageContainer>
      </ProLayout>
    </View>
  )
}