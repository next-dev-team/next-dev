import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials01() {
  return (
    <View className="w-full max-w-2xl px-4 py-12 text-center mx-auto gap-6">
      <Text className="text-2xl font-medium italic">
        "This library has saved me hundreds of hours of development time. It is absolutely incredible."
      </Text>
      <View className="items-center gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <View>
          <Text className="font-semibold">Jane Doe</Text>
          <Text className="text-sm text-muted-foreground">CTO, Tech Corp</Text>
        </View>
      </View>
    </View>
  );
}
