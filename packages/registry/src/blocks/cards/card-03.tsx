import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Card03() {
  return (
    <Card className="w-full max-w-sm items-center p-6">
        <Avatar className="h-24 w-24" alt="Avatar">
             <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
             <AvatarFallback>
                <Text>CN</Text>
             </AvatarFallback>
        </Avatar>
        <View className="items-center mt-4 gap-1">
            <CardTitle>Jane Doe</CardTitle>
            <Text className="text-sm text-muted-foreground">Product Designer</Text>
        </View>
        <View className="mt-6 flex-row gap-4">
            <Button>
                <Text>Follow</Text>
            </Button>
            <Button variant="outline">
                <Text>Message</Text>
            </Button>
        </View>
    </Card>
  );
}
