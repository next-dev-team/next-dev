import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';

export function Contact10() {
  return (
    <View className="w-full px-4 py-12 text-center">
       <Text className="text-muted-foreground mb-4">Questions?</Text>
       <Button variant="link" size="lg">
         <Text className="text-2xl md:text-3xl">contact@example.com</Text>
       </Button>
    </View>
  );
}