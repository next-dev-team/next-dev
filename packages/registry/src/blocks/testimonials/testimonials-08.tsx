import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials08() {
  return (
    <View className="w-full max-w-6xl px-4 py-12 flex-col md:flex-row gap-12">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold mb-4">Trusted by developers worldwide.</Text>
        <Text className="text-muted-foreground text-lg">
          Join our community and start building better apps today.
        </Text>
      </View>
      <View className="flex-1 gap-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-row items-center gap-4 p-4 bg-muted/20 rounded-lg">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>U{i}</AvatarFallback>
            </Avatar>
            <View>
              <Text className="font-medium">"Great experience!"</Text>
              <Text className="text-xs text-muted-foreground">User {i}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}