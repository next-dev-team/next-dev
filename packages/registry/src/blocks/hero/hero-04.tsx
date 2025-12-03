import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Input } from '@/registry/new-york/components/ui/input';

export function Hero04() {
  return (
    <View className="w-full max-w-md items-center gap-6 px-4 py-12 text-center">
      <View className="gap-2">
        <Text className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Subscribe to our newsletter
        </Text>
        <Text className="text-muted-foreground text-lg">
          Stay updated with the latest news and exclusive offers.
        </Text>
      </View>
      <View className="w-full max-w-sm flex-row gap-2">
        <Input placeholder="Enter your email" className="flex-1" />
        <Button>
          <Text>Subscribe</Text>
        </Button>
      </View>
      <Text className="text-muted-foreground text-xs">
        We respect your privacy. Unsubscribe at any time.
      </Text>
    </View>
  );
}
