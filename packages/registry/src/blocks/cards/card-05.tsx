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
import { Switch } from '@/registry/new-york/components/ui/switch';
import { Label } from '@/registry/new-york/components/ui/label';

export function Card05() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const [isMarketingEnabled, setIsMarketingEnabled] = React.useState(false);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>Manage your cookie preferences.</CardDescription>
      </CardHeader>
      <CardContent className="gap-6">
        <View className="flex-row items-center justify-between space-x-2">
          <Label htmlFor="functional" className="flex-col space-y-1">
            <Text>Functional Cookies</Text>
            <Text className="font-normal leading-snug text-muted-foreground text-xs">
              These cookies are essential for the website to function.
            </Text>
          </Label>
          <Switch id="functional" checked={isNotificationsEnabled} onCheckedChange={setIsNotificationsEnabled} />
        </View>
        <View className="flex-row items-center justify-between space-x-2">
          <Label htmlFor="marketing" className="flex-col space-y-1">
             <Text>Marketing Cookies</Text>
            <Text className="font-normal leading-snug text-muted-foreground text-xs">
              These cookies are used to track your browsing habits.
            </Text>
          </Label>
          <Switch id="marketing" checked={isMarketingEnabled} onCheckedChange={setIsMarketingEnabled} />
        </View>
      </CardContent>
    </Card>
  );
}
