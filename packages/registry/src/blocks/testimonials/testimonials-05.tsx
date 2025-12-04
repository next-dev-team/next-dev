<<<<<<< HEAD
import * as React from 'react';
import { View, Image } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader } from '@/registry/new-york/components/ui/card';
=======
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Star } from 'lucide-react-native';
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials05() {
  return (
<<<<<<< HEAD
    <View className="w-full max-w-md gap-6">
      <View className="gap-2 text-center">
        <Text className="text-3xl font-bold">What our users say</Text>
        <Text className="text-muted-foreground">Trusted by thousands of developers.</Text>
      </View>
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar alt="Avatar">
            <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <View>
            <Text className="font-semibold">User Name 05</Text>
            <Text className="text-sm text-muted-foreground">@username</Text>
          </View>
        </CardHeader>
        <CardContent>
          <Text>
            "This library has saved me so much time. The components are beautiful and easy to use. Highly recommended!"
=======
    <View className="mx-auto w-full max-w-md p-4">
      <Card>
        <CardContent className="gap-4 pt-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-3">
              <Avatar alt="Alex Chen">
                <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
                <AvatarFallback>
                  <Text>CN</Text>
                </AvatarFallback>
              </Avatar>
              <View>
                <Text className="font-semibold">Alex Chen</Text>
                <Text className="text-muted-foreground text-xs">2 days ago</Text>
              </View>
            </View>
            <View className="flex-row gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Icon key={i} as={Star} size={16} className="fill-yellow-500 text-yellow-500" />
              ))}
            </View>
          </View>
          <Text className="text-base">
            Absolutely love the attention to detail. The dark mode support is flawless and the
            accessibility features are top-notch.
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
