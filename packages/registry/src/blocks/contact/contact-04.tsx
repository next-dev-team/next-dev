import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Input } from '@/registry/new-york/components/ui/input';
import { Textarea } from '@/registry/new-york/components/ui/textarea';
import { Button } from '@/registry/new-york/components/ui/button';

export function Contact04() {
  return (
    <View className="w-full max-w-2xl px-4 py-12 mx-auto">
      <View className="text-center mb-8 gap-2">
        <Text className="text-3xl font-bold">Send us a message</Text>
        <Text className="text-muted-foreground">We'd love to hear from you.</Text>
      </View>
      <View className="gap-4 p-6 border rounded-xl bg-card">
        <View className="flex-row gap-4">
          <Input placeholder="First Name" className="flex-1" />
          <Input placeholder="Last Name" className="flex-1" />
        </View>
        <Input placeholder="Email" keyboardType="email-address" />
        <Textarea placeholder="Your message..." className="min-h-[120px]" />
        <Button size="lg" className="w-full">
          <Text>Send Message</Text>
        </Button>
      </View>
    </View>
  );
}