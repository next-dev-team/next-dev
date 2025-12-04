import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';

export function Stats02() {
  return (
    <View className="w-full max-w-5xl px-4 py-12">
      <View className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Text className="text-muted-foreground">$</Text>
            </CardHeader>
            <CardContent>
              <Text className="text-2xl font-bold">$45,231.89</Text>
              <Text className="text-xs text-muted-foreground">+20.1% from last month</Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  );
}