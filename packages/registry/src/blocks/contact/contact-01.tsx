import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Input } from '@/registry/new-york/components/ui/input';
import { Textarea } from '@/registry/new-york/components/ui/textarea';
import { Label } from '@/registry/new-york/components/ui/label';
import { Button } from '@/registry/new-york/components/ui/button';

export function Contact01() {
  return (
    <View className="w-full max-w-md px-4 py-12 gap-6">
      <View className="gap-2">
        <Text className="text-3xl font-bold">Contact Us</Text>
        <Text className="text-muted-foreground">Send us a message and we'll respond as soon as possible.</Text>
      </View>
      <View className="gap-4">
        <View className="gap-2">
          <Label nativeID="name">Name</Label>
          <Input placeholder="Your name" nativeID="name" />
        </View>
        <View className="gap-2">
          <Label nativeID="email">Email</Label>
          <Input placeholder="m@example.com" nativeID="email" keyboardType="email-address" />
        </View>
        <View className="gap-2">
          <Label nativeID="message">Message</Label>
          <Textarea placeholder="How can we help you?" nativeID="message" />
        </View>
        <Button>
          <Text>Send Message</Text>
        </Button>
      </View>
    </View>
  );
}