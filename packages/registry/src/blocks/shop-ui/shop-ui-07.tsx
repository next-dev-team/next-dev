import * as React from 'react';
import { View } from 'react-native';
import { Mail } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Input } from '@/registry/new-york/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/registry/new-york/components/ui/card';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ShopUi07() {
  return (
    <Card className="w-full max-w-md bg-primary/5 border-primary/20">
      <CardHeader className="items-center text-center pb-2">
        <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Icon as={Mail} className="text-primary" size={24} />
        </View>
        <CardTitle className="text-xl">Subscribe & Save</CardTitle>
        <CardDescription>Get 10% off your first order when you sign up.</CardDescription>
      </CardHeader>
      <CardContent className="gap-3">
        <Input placeholder="Enter your email" />
        <Button className="w-full">
            <Text>Subscribe</Text>
        </Button>
        <Text className="text-xs text-center text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
        </Text>
      </CardContent>
    </Card>
  );
}