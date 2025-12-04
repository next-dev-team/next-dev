import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials05() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="bg-muted/30 p-8 rounded-2xl flex-row gap-6 items-start">
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <View className="flex-1 gap-2">
          <Text className="text-xl font-medium">
            "I've never used a library this flexible before. It fits perfectly into our existing stack."
          </Text>
          <View className="mt-2">
            <Text className="font-bold">John Smith</Text>
            <Text className="text-sm text-muted-foreground">Product Manager</Text>
          </View>
        </View>
      </View>
    </View>
  );
}