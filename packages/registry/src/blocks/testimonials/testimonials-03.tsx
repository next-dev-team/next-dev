import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials03() {
  return (
    <View className="w-full max-w-6xl px-4 py-12">
      <View className="grid gap-8 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <View key={i} className="gap-4">
            <Text className="text-muted-foreground italic">
              "The best solution for our needs. It just works."
            </Text>
            <View className="flex-row items-center gap-2">
               <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Text className="font-medium text-sm">Happy Customer</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}