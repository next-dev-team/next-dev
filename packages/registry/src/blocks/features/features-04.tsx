import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/registry/new-york/components/ui/card';
import { Check } from 'lucide-react-native';

export function Features04() {
  return (
    <View className="w-full max-w-md gap-4">
      <View className="gap-2">
        <Text className="text-3xl font-bold">Features 04</Text>
        <Text className="text-muted-foreground">Discover what makes our product unique.</Text>
      </View>
      <View className="gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              <View className="bg-primary/10 h-10 w-10 items-center justify-center rounded-full">
                <Check className="text-primary" size={20} />
              </View>
              <View className="flex-1">
                <CardTitle>Feature {i}</CardTitle>
                <CardDescription>Description for feature {i}</CardDescription>
              </View>
            </CardHeader>
          </Card>
        ))}
      </View>
    </View>
  );
}
