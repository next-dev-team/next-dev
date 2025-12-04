import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Team05() {
  return (
    <View className="w-full max-w-sm items-center gap-4 p-6">
      <Text className="font-medium">Contributors</Text>
      <View className="flex-row">
        {[1, 2, 3, 4].map((i) => (
          <Avatar key={i} className="border-background -ml-3 border-2 first:ml-0">
            <AvatarImage source={{ uri: `https://i.pravatar.cc/150?u=${i}` }} />
            <AvatarFallback>
              <Text>U{i}</Text>
            </AvatarFallback>
          </Avatar>
        ))}
        <View className="bg-muted border-background -ml-3 h-10 w-10 items-center justify-center rounded-full border-2">
          <Text className="text-xs font-medium">+5</Text>
        </View>
      </View>
      <Text className="text-muted-foreground text-sm">
        Join 20+ contributors building this project.
      </Text>
    </View>
  );
}
