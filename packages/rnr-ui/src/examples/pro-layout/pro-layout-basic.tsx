import { ProLayout, PageContainer } from '@/rnr-ui/components/ui';
import type { RouteItem } from '@/rnr-ui/components/ui';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';

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
};

export function ProLayoutBasicPreview() {
  return (
    <View className="h-[600px] w-full">
      <ProLayout
        title="Admin"
        route={route}
        layout="mix"
        navTheme="dark"
        fixSiderbar
        fixedHeader
        headerContentRender={() => <Button size="sm"><Text>New</Text></Button>}
        rightContentRender={() => <Text className="text-sm">User</Text>}
        location={{ pathname: '/users/list' }}
      >
        <PageContainer
          title="Users"
          subTitle="Manage system users"
          extra={<Button><Text>Add User</Text></Button>}
          breadcrumb={{ routes: [
            { path: '/', breadcrumbName: 'Home' },
            { path: '/users', breadcrumbName: 'Users' },
            { path: '/users/list', breadcrumbName: 'List' },
          ]}}
          tabList={[
            { key: 'list', tab: <Text>List</Text> },
            { key: 'activity', tab: <Text>Activity</Text> },
          ]}
          content={<Text className="text-muted-foreground">Use actions for page operations</Text>}
          waterMarkProps={{ content: 'internal', opacity: 0.2 }}
        >
          <View className="p-4">
            <Text>Page body</Text>
          </View>
        </PageContainer>
      </ProLayout>
    </View>
  );
}