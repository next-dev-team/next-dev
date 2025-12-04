import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Blog04() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="grid md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <View key={i} className="gap-4">
            <View className="h-48 bg-muted rounded-xl" />
            <Text className="text-xl font-bold">Building Scalable Systems</Text>
            <View className="flex-row items-center gap-3">
               <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <View>
                <Text className="text-sm font-medium">Author Name</Text>
                <Text className="text-xs text-muted-foreground">Oct 12 • 5 min read</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}