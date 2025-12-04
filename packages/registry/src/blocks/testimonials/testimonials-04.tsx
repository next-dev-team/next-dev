import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Quote } from 'lucide-react-native';

export function Testimonials04() {
  return (
    <View className="w-full max-w-3xl px-4 py-16 mx-auto text-center">
      <Icon as={Quote} size={48} className="text-primary/20 mx-auto mb-6" />
      <Text className="text-3xl md:text-4xl font-bold leading-tight mb-8">
        "We were able to launch our product in weeks instead of months. The documentation is top-notch."
      </Text>
      <View>
        <Text className="text-xl font-semibold">Sarah Connor</Text>
        <Text className="text-muted-foreground">Director of Engineering</Text>
      </View>
    </View>
  );
}