<<<<<<< HEAD
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/registry/new-york/components/ui/card';
=======
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
import { Check } from 'lucide-react-native';

export function Features05() {
  return (
<<<<<<< HEAD
    <View className="w-full max-w-md gap-4">
      <View className="gap-2">
        <Text className="text-3xl font-bold">Features 05</Text>
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
=======
    <View className="w-full max-w-md mx-auto p-6">
      <Text className="text-2xl font-bold mb-6">Plan Includes</Text>
      <View className="gap-4">
        {[
            "Unlimited Projects",
            "Team Collaboration",
            "Advanced Analytics",
            "Custom Domain",
            "Priority Support",
            "SSO Integration",
            "Audit Logs",
            "SLA 99.99%"
        ].map((feature, i) => (
            <View key={i} className="flex-row items-center gap-3 border-b border-border/40 pb-4 last:border-0">
                <View className="h-6 w-6 rounded-full bg-primary/10 items-center justify-center">
                    <Icon as={Check} size={14} className="text-primary" />
                </View>
                <Text className="text-base font-medium">{feature}</Text>
            </View>
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
        ))}
      </View>
    </View>
  );
}
