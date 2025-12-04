import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/registry/new-york/components/ui/card';
import { Button } from '@/registry/new-york/components/ui/button';

export function Blog07() {
  return (
    <View className="w-full max-w-md gap-4">
      <View className="gap-2">
        <Text className="text-3xl font-bold">Latest Updates 07</Text>
        <Text className="text-muted-foreground">Read our latest articles and news.</Text>
      </View>
      <Card>
        <CardHeader>
          <View className="flex-row justify-between">
            <Text className="text-muted-foreground text-sm">Dec 04, 2025</Text>
          </View>
          <CardTitle>Blog Post Title 07</CardTitle>
          <CardDescription>
            A brief description of the blog post goes here. It summarizes the content to encourage
            reading.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost" className="px-0">
            <Text>Read More</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
