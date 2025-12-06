import * as React from 'react';
import { View } from 'react-native';
import { Badge } from '@/registry/new-york/components/ui/badge';
import { Text } from '@/registry/new-york/components/ui/text';

export function Pos10() {
  return (
    <View className="flex-row justify-between items-center p-4 border rounded-lg bg-card w-full max-w-sm">
        <View>
            <Text className="font-medium">#ORD-001</Text>
            <Text className="text-xs text-muted-foreground">Today, 10:30 AM</Text>
        </View>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Text>Completed</Text>
        </Badge>
        <Text className="font-bold">$45.20</Text>
    </View>
  );
}