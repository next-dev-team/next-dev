<<<<<<< HEAD
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/registry/new-york/components/ui/card';
import { Check } from 'lucide-react-native';

export function Features02() {
  return (
    <View className="w-full max-w-md gap-4">
      <View className="gap-2">
        <Text className="text-3xl font-bold">Features 02</Text>
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
=======
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { CheckCircle2 } from 'lucide-react-native';

export function Features02() {
  return (
    <View className="w-full max-w-4xl mx-auto p-6 flex-row flex-wrap items-center gap-12">
      <View className="flex-1 min-w-[300px] gap-6">
        <Text className="text-3xl font-bold">Why choose us?</Text>
        <Text className="text-muted-foreground text-lg">
          We provide the best tools for your development workflow.
        </Text>
        
        <View className="gap-4">
            {["Real-time updates", "Unlimited storage", "24/7 Support", "Custom domains"].map((item, i) => (
                <View key={i} className="flex-row items-center gap-3">
                    <Icon as={CheckCircle2} size={20} className="text-primary" />
                    <Text className="text-lg font-medium">{item}</Text>
                </View>
            ))}
        </View>
      </View>
      
      <View className="flex-1 min-w-[300px] aspect-square bg-muted rounded-2xl items-center justify-center">
        <Text className="text-muted-foreground">Feature Image</Text>
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
      </View>
    </View>
  );
}
