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
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';
import { Button } from '@/registry/new-york/components/ui/button';

export function Team02() {
  return (
    <Card className="w-full max-w-xs text-center">
      <CardHeader>
         <View className="items-center justify-center">
             <Avatar className="h-24 w-24">
                <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
                <AvatarFallback>
                    <Text>JD</Text>
                </AvatarFallback>
            </Avatar>
         </View>
        <CardTitle className="mt-4">Jane Doe</CardTitle>
        <CardDescription>Product Manager</CardDescription>
      </CardHeader>
      <CardContent>
        <Text className="text-sm text-muted-foreground">
            Passionate about building great products and leading teams to success.
        </Text>
        <View className="mt-4">
             <Button variant="outline" className="w-full">
                <Text>View Profile</Text>
             </Button>
        </View>
      </CardContent>
    </Card>
  );
}
