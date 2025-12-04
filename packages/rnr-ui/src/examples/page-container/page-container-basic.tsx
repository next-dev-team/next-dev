import { PageContainer } from '@/rnr-ui/components/ui';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';

export function PageContainerBasicPreview() {
  return (
    <View className="w-full">
      <PageContainer
        title="Orders"
        subTitle="Daily orders overview"
        extra={
          <Button>
            <Text>Export</Text>
          </Button>
        }
        breadcrumb={{
          routes: [
            { path: '/', breadcrumbName: 'Home' },
            { path: '/orders', breadcrumbName: 'Orders' },
            { path: '/orders/today', breadcrumbName: 'Today' },
          ],
        }}
        tabList={[
          { key: 'today', tab: <Text>Today</Text> },
          { key: 'week', tab: <Text>This Week</Text> },
        ]}
        content={<Text className="text-muted-foreground">Quick insights and actions</Text>}
        waterMarkProps={{ content: 'company', rotate: -20, opacity: 0.15 }}
        footer={<Text>Total 120 orders</Text>}
      >
        <View className="p-4">
          <Text>Charts and tables</Text>
        </View>
      </PageContainer>
    </View>
  );
}
