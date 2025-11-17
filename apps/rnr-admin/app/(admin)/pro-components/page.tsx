'use client';

import { PageContainer } from '@/components/layout/page-container';
import {
  ProCard,
  ProList,
  ProDescriptions,
  createDescriptionsItems,
} from '@rnr/rnr-ui-pro';
import { Button } from '@/registry/new-york/components/ui/button';
import { Badge } from '@/registry/new-york/components/ui/badge';
import { Text } from '@/registry/new-york/components/ui/text';
import { View } from 'react-native';
import { Sparkles, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function ProComponentsPage() {
  const listData = [
    {
      id: '1',
      title: 'Task 1: Review pull request',
      description: 'Review and merge the new feature branch',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Task 2: Update documentation',
      description: 'Add API documentation for new endpoints',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Task 3: Fix bug in dashboard',
      description: 'Resolve the chart rendering issue',
      status: 'in-progress',
    },
  ];

  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    department: 'Engineering',
    joinDate: '2024-01-15',
    salary: 85000,
    performance: 95,
  };

  const userItems = createDescriptionsItems([
    { label: 'Name', dataIndex: 'name' },
    { label: 'Email', dataIndex: 'email' },
    { label: 'Role', dataIndex: 'role' },
    { label: 'Department', dataIndex: 'department' },
    {
      label: 'Join Date',
      dataIndex: 'joinDate',
      valueType: 'date',
    },
    {
      label: 'Salary',
      dataIndex: 'salary',
      valueType: 'money',
    },
    {
      label: 'Performance',
      dataIndex: 'performance',
      valueType: 'percent',
    },
  ]);

  return (
    <PageContainer
      title="Pro Components Showcase"
      description="Explore all the professional components from @rnr/rnr-ui-pro"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pro Components' },
      ]}
    >
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProCard bordered hoverable>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted-foreground">Total Users</Text>
                <Text className="text-3xl font-bold mt-2">1,234</Text>
                <Text className="text-sm text-green-600 mt-1">+12.5%</Text>
              </View>
              <Users className="h-10 w-10 text-primary" />
            </View>
          </ProCard>

          <ProCard bordered hoverable>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted-foreground">Revenue</Text>
                <Text className="text-3xl font-bold mt-2">$45.6K</Text>
                <Text className="text-sm text-green-600 mt-1">+8.2%</Text>
              </View>
              <DollarSign className="h-10 w-10 text-primary" />
            </View>
          </ProCard>

          <ProCard bordered hoverable>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted-foreground">Growth</Text>
                <Text className="text-3xl font-bold mt-2">23.1%</Text>
                <Text className="text-sm text-green-600 mt-1">+5.4%</Text>
              </View>
              <TrendingUp className="h-10 w-10 text-primary" />
            </View>
          </ProCard>

          <ProCard bordered hoverable>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted-foreground">Active Now</Text>
                <Text className="text-3xl font-bold mt-2">573</Text>
                <Text className="text-sm text-green-600 mt-1">Live</Text>
              </View>
              <Sparkles className="h-10 w-10 text-primary" />
            </View>
          </ProCard>
        </div>

        {/* ProCard with Tabs */}
        <ProCard
          title="Analytics Dashboard"
          subTitle="View your performance metrics"
          extra={
            <Button variant="outline">
              <Text>Export</Text>
            </Button>
          }
          bordered
          tabs={{
            tabList: [
              { key: 'overview', tab: 'Overview' },
              { key: 'details', tab: 'Details' },
              { key: 'reports', tab: 'Reports' },
            ],
            defaultActiveKey: 'overview',
          }}
        >
          <View className="py-6">
            <Text className="text-center text-muted-foreground">
              Chart and analytics content goes here
            </Text>
          </View>
        </ProCard>

        {/* ProList */}
        <ProCard title="Task List" bordered>
          <ProList
            dataSource={listData}
            metas={{
              title: {
                dataIndex: 'title',
                render: (title: string) => (
                  <Text className="font-semibold">{title}</Text>
                ),
              },
              description: {
                dataIndex: 'description',
              },
              actions: {
                render: (item: any) => [
                  <Badge
                    key="status"
                    variant={
                      item.status === 'completed'
                        ? 'default'
                        : item.status === 'in-progress'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    <Text>{item.status}</Text>
                  </Badge>,
                  <Button key="view" size="sm" variant="ghost">
                    <Text>View</Text>
                  </Button>,
                ],
              },
            }}
            bordered={false}
          />
        </ProCard>

        {/* ProDescriptions */}
        <ProDescriptions
          title="User Profile"
          extra={
            <Button variant="outline">
              <Text>Edit</Text>
            </Button>
          }
          bordered
          column={2}
          dataSource={userData}
          items={userItems}
        />

        {/* Feature List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProCard title="Available Components" bordered>
            <ul className="space-y-2 text-sm">
              <li>✅ ProForm - Advanced forms</li>
              <li>✅ QueryForm - Search forms</li>
              <li>✅ ModalForm - Modal dialogs</li>
              <li>✅ LoginForm - Pre-built auth</li>
              <li>✅ RegisterForm - Pre-built signup</li>
              <li>✅ ProTable - Data tables</li>
              <li>✅ ProList - Enhanced lists</li>
              <li>✅ ProCard - Advanced cards</li>
              <li>✅ ProDescriptions - Data display</li>
              <li>✅ PageContainer - Page layouts</li>
              <li>✅ ProHeader - Page headers</li>
            </ul>
          </ProCard>

          <ProCard title="Features" bordered>
            <ul className="space-y-2 text-sm">
              <li>🎯 Universal platform support</li>
              <li>🎨 Built on @rnr/registry</li>
              <li>📝 Form validation with rc-field-form</li>
              <li>🔍 Search and filtering</li>
              <li>📊 Sorting and pagination</li>
              <li>💅 Styled with NativeWind</li>
              <li>🔧 Fully customizable</li>
              <li>📱 Mobile-first design</li>
              <li>♿ Accessibility support</li>
              <li>⚡ Optimized performance</li>
            </ul>
          </ProCard>
        </div>
      </div>
    </PageContainer>
  );
}

