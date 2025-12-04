import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';

export function Stats01() {
  return (
    <View className="w-full max-w-md gap-4">
      <View className="gap-2">
        <Text className="text-3xl font-bold">Platform Statistics 01</Text>
        <Text className="text-muted-foreground">Real-time metrics from your application.</Text>
      </View>
      <View className="flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-2xl font-bold">$45,231.89</Text>
            <Text className="text-xs text-muted-foreground">+20.1% from last month</Text>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-2xl font-bold">+2350</Text>
            <Text className="text-xs text-muted-foreground">+180.1% from last month</Text>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
