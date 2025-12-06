import * as React from 'react';
import { View } from 'react-native';
import { MapPin, Phone, Clock } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ShopUi06() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Downtown Store</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="flex-row gap-3">
            <Icon as={MapPin} className="text-primary mt-1" size={18} />
            <View>
                <Text className="font-medium">123 Fashion Ave</Text>
                <Text className="text-sm text-muted-foreground">New York, NY 10001</Text>
            </View>
        </View>
        <View className="flex-row gap-3">
            <Icon as={Phone} className="text-primary mt-1" size={18} />
            <Text>+1 (555) 123-4567</Text>
        </View>
        <View className="flex-row gap-3">
            <Icon as={Clock} className="text-primary mt-1" size={18} />
            <View>
                <Text>Mon-Sat: 10am - 9pm</Text>
                <Text>Sun: 11am - 6pm</Text>
            </View>
        </View>
        <Button variant="outline" className="mt-2">
            <Text>Get Directions</Text>
        </Button>
      </CardContent>
    </Card>
  );
}