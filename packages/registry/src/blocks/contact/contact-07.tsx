import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';

export function Contact07() {
  return (
    <View className="w-full max-w-4xl px-4 py-12 gap-12">
      <View className="text-center">
        <Text className="text-2xl font-bold">Still have questions?</Text>
        <Text className="text-muted-foreground mt-2">Check our FAQ or contact support.</Text>
      </View>
      <View className="grid md:grid-cols-2 gap-8">
        <View className="gap-2">
            <Text className="font-semibold">How long does shipping take?</Text>
            <Text className="text-muted-foreground">Usually 2-3 business days.</Text>
        </View>
        <View className="gap-2">
            <Text className="font-semibold">Do you offer refunds?</Text>
            <Text className="text-muted-foreground">Yes, within 30 days of purchase.</Text>
        </View>
      </View>
      <View className="items-center">
        <Button>
            <Text>Contact Support</Text>
        </Button>
      </View>
    </View>
  );
}