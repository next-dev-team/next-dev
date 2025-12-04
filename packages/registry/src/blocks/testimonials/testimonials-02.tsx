import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/registry/new-york/components/ui/card';

export function Testimonials02() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="grid gap-6 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <View>
                <Text className="font-semibold">User Name</Text>
                <Text className="text-sm text-muted-foreground">Developer</Text>
              </View>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground">
                "This is an amazing product. I highly recommend it to everyone."
              </Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  );
}