import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Star } from 'lucide-react-native';

export function Testimonials07() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="grid md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <View key={i} className="gap-4 p-6 bg-card border rounded-xl">
             <View className="flex-row gap-1">
               {[1, 2, 3, 4, 5].map((star) => (
                 <Icon key={star} as={Star} size={16} className="text-yellow-500 fill-yellow-500" />
               ))}
             </View>
             <Text className="text-lg font-medium">"Exceptional quality and support."</Text>
             <View>
               <Text className="font-bold">Customer {i}</Text>
             </View>
          </View>
        ))}
      </View>
    </View>
  );
}