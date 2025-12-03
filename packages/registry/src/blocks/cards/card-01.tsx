import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';

export function Card01() {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <View className="h-40 w-full bg-muted items-center justify-center">
         <Text className="text-muted-foreground">Image Placeholder</Text>
      </View>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description goes here.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">
          <Text>Action</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
