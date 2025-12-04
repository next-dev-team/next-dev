import * as React from 'react';
import { View } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Bell } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Card04() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        {[
          'Your subscription is expiring soon.',
          'New login from Chrome on Windows.',
          'Your report is ready to download.',
        ].map((notification, index) => (
          <View
            key={index}
            className="hover:bg-accent hover:text-accent-foreground flex-row items-start space-x-4 rounded-md p-2 transition-all"
          >
            <Icon as={Bell} size={16} className="text-primary mt-px" />
            <View className="flex-1 space-y-1">
              <Text className="text-sm font-medium leading-none">Notification</Text>
              <Text className="text-muted-foreground text-sm">{notification}</Text>
            </View>
          </View>
        ))}
      </CardContent>
    </Card>
  );
}
