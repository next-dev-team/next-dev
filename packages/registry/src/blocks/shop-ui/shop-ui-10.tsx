import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function ShopUi10() {
  return (
    <View className="absolute bottom-0 w-full bg-background border-t p-4 flex-row items-center justify-between shadow-lg gap-4">
        <Text className="flex-1 text-sm text-muted-foreground">
            We use cookies to enhance your shopping experience. By continuing to browse, you agree to our use of cookies.
        </Text>
        <View className="flex-row gap-2">
            <Button variant="outline" size="sm">
                <Text>Preferences</Text>
            </Button>
            <Button size="sm">
                <Text>Accept All</Text>
            </Button>
        </View>
    </View>
  );
}