import React, { useState } from 'react';
import { View } from 'react-native';
import { PageContainer } from '../components/page-container';
import { ProCard } from '../components/pro-card';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Badge } from '@rnr/registry/src/new-york/components/ui/badge';

/**
 * Example: PageContainer with tabs and breadcrumb
 */
export function PageContainerExample() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <PageContainer
      title="Dashboard"
      subTitle="Welcome back! Here's an overview of your account"
      breadcrumb={{
        items: [
          { title: 'Home', onPress: () => console.log('Go to home') },
          { title: 'Dashboard' },
        ],
      }}
      header={{
        tags: (
          <>
            <Badge>
              <Text>Pro Plan</Text>
            </Badge>
            <Badge variant="secondary">
              <Text>Active</Text>
            </Badge>
          </>
        ),
        extra: (
          <Button>
            <Text>Settings</Text>
          </Button>
        ),
      }}
      tabList={[
        { key: 'overview', tab: 'Overview' },
        { key: 'analytics', tab: 'Analytics' },
        { key: 'settings', tab: 'Settings' },
      ]}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <View className="gap-4">
          <ProCard title="Statistics" bordered>
            <View className="flex-row justify-around py-4">
              <View className="items-center">
                <Text className="text-3xl font-bold">1,234</Text>
                <Text className="text-muted-foreground">Users</Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl font-bold">5,678</Text>
                <Text className="text-muted-foreground">Sessions</Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl font-bold">89%</Text>
                <Text className="text-muted-foreground">Satisfaction</Text>
              </View>
            </View>
          </ProCard>

          <ProCard title="Recent Activity" bordered>
            <Text className="py-4 text-muted-foreground">
              No recent activity to display.
            </Text>
          </ProCard>
        </View>
      )}

      {activeTab === 'analytics' && (
        <ProCard title="Analytics Dashboard" bordered>
          <Text className="py-4">Analytics content goes here...</Text>
        </ProCard>
      )}

      {activeTab === 'settings' && (
        <ProCard title="Account Settings" bordered>
          <Text className="py-4">Settings content goes here...</Text>
        </ProCard>
      )}
    </PageContainer>
  );
}

