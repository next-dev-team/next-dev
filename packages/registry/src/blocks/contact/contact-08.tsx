import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Input } from '@/registry/new-york/components/ui/input';
import { Button } from '@/registry/new-york/components/ui/button';

export function Contact08() {
  return (
    <View className="w-full bg-muted/50 px-4 py-16">
      <View className="max-w-xl mx-auto text-center gap-6">
        <Text className="text-2xl font-bold">Subscribe to our newsletter</Text>
        <Text className="text-muted-foreground">
            Get the latest news and updates delivered directly to your inbox.
        </Text>
        <View className="flex-row gap-2">
            <Input placeholder="Enter your email" className="flex-1 bg-background" />
            <Button>
                <Text>Subscribe</Text>
            </Button>
        </View>
        <Text className="text-xs text-muted-foreground">
            We care about your data in our privacy policy.
        </Text>
      </View>
    </View>
  );
}