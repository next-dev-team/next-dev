import * as React from 'react';
import { View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { TrendingUp } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Card02() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <Icon as={TrendingUp} size={16} className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Text className="text-2xl font-bold">$45,231.89</Text>
        <Text className="text-muted-foreground text-xs">+20.1% from last month</Text>
      </CardContent>
    </Card>
  );
}
