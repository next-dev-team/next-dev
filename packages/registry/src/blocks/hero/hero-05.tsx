import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function Hero05() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="grid items-center gap-8 md:grid-cols-2">
        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Trusted by thousands
            </Text>
            <Text className="text-muted-foreground text-lg">
              Join the community of developers building the future.
            </Text>
          </View>
          <View className="flex-row gap-4">
            <Button>
              <Text>Join Now</Text>
            </Button>
          </View>
        </View>
        <View className="bg-card rounded-xl border p-6">
          <View className="flex-row justify-between gap-4">
            <View>
              <Text className="text-3xl font-bold">10k+</Text>
              <Text className="text-muted-foreground text-sm">Users</Text>
            </View>
            <Separator orientation="vertical" className="h-auto" />
            <View>
              <Text className="text-3xl font-bold">50M+</Text>
              <Text className="text-muted-foreground text-sm">Downloads</Text>
            </View>
            <Separator orientation="vertical" className="h-auto" />
            <View>
              <Text className="text-3xl font-bold">99.9%</Text>
              <Text className="text-muted-foreground text-sm">Uptime</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
