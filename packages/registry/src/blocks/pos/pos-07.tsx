import * as React from 'react';
import { View } from 'react-native';
import { Search, UserPlus } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Input } from '@/registry/new-york/components/ui/input';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Pos07() {
  return (
    <View className="p-4 border rounded-lg gap-4 bg-card w-full max-w-sm">
        <Text className="font-semibold">Customer</Text>
        <View className="flex-row gap-2">
            <View className="flex-1 relative justify-center">
                 <View className="absolute left-2.5 z-10">
                    <Icon as={Search} className="text-muted-foreground" size={16} />
                 </View>
                 <Input placeholder="Search customer..." className="pl-9" />
            </View>
            <Button size="icon" variant="outline">
                <Icon as={UserPlus} size={18} className="text-foreground" />
            </Button>
        </View>
    </View>
  );
}