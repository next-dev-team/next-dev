import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Input } from '@/registry/new-york/components/ui/input';
import { Button } from '@/registry/new-york/components/ui/button';
import { Label } from '@/registry/new-york/components/ui/label';

export function Contact02() {
  return (
    <View className="w-full max-w-4xl px-4 py-12 gap-8 md:flex-row">
      <View className="flex-1 gap-6">
        <Text className="text-3xl font-bold">Get in touch</Text>
        <View className="gap-4">
           <View className="gap-2">
            <Label>Name</Label>
            <Input placeholder="Name" />
          </View>
          <View className="gap-2">
            <Label>Email</Label>
            <Input placeholder="Email" />
          </View>
          <Button>
            <Text>Submit</Text>
          </Button>
        </View>
      </View>
      <View className="flex-1 h-64 md:h-auto bg-muted rounded-xl items-center justify-center">
        <Text className="text-muted-foreground">Map Placeholder</Text>
      </View>
    </View>
  );
}