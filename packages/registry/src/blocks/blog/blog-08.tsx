import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardFooter, CardHeader } from '@/registry/new-york/components/ui/card';
import { Badge } from '@/registry/new-york/components/ui/badge';

export function Blog08() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <View className="h-40 bg-muted w-full" />
            <CardHeader>
              <Text className="text-xl font-bold">The State of JS 2024</Text>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground line-clamp-3">
                 An overview of the current state of the JavaScript ecosystem and what to expect in the coming years.
              </Text>
            </CardContent>
            <CardFooter className="gap-2">
                <Badge variant="outline"><Text>JavaScript</Text></Badge>
                <Badge variant="outline"><Text>Survey</Text></Badge>
            </CardFooter>
          </Card>
        ))}
      </View>
    </View>
  );
}