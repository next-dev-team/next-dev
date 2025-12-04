import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';

export function Features10() {
  return (
    <View className="w-full bg-primary px-4 py-16">
      <View className="max-w-4xl mx-auto text-center gap-6">
        <Text className="text-3xl md:text-5xl font-bold text-primary-foreground">
          Ready to get started?
        </Text>
        <Text className="text-primary-foreground/80 text-xl">
          Join thousands of developers building with our tools today.
        </Text>
        <View className="flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg">
            <Text>Get Started Now</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}