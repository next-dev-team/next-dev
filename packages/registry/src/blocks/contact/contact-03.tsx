import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Label } from '@/registry/new-york/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/registry/new-york/components/ui/card';

export function Contact03() {
  return (
    <View className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us 03</CardTitle>
          <CardDescription>Send us a message and we'll get back to you.</CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="gap-2">
            <Label nativeID="name">Name</Label>
            <Input placeholder="Your name" />
          </View>
          <View className="gap-2">
            <Label nativeID="email">Email</Label>
            <Input placeholder="m@example.com" />
          </View>
          <Button className="w-full">
            <Text>Send Message</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
