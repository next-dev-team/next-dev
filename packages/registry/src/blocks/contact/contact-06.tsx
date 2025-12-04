import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';
import { Button } from '@/registry/new-york/components/ui/button';

export function Contact06() {
  return (
    <View className="w-full h-[500px] bg-muted relative">
      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-muted-foreground">Map Background</Text>
      </View>
      <View className="absolute bottom-8 left-4 right-4 md:left-auto md:right-8 md:top-8 md:bottom-auto md:w-96">
        <Card>
            <CardContent className="p-6 gap-4">
                <Text className="font-bold text-xl">Visit Us</Text>
                <Text className="text-muted-foreground">
                    123 Innovation Drive<br />
                    Tech City, TC 90210
                </Text>
                <Button variant="outline" className="w-full">
                    <Text>Get Directions</Text>
                </Button>
            </CardContent>
        </Card>
      </View>
    </View>
  );
}