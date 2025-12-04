<<<<<<< HEAD
import * as React from 'react';
import { View, Image } from 'react-native';
=======
import { View } from 'react-native';
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader } from '@/registry/new-york/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials01() {
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
            <Text className="font-semibold">User Name 01</Text>
            <Text className="text-sm text-muted-foreground">@username</Text>
          </View>
        </CardHeader>
        <CardContent>
          <Text>
            "This library has saved me so much time. The components are beautiful and easy to use. Highly recommended!"
          </Text>
        </CardContent>
      </Card>
    </View>
=======
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <Avatar alt="Sarah Johnson">
          <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
          <AvatarFallback asChild>
            <Text>CN</Text>
          </AvatarFallback>
        </Avatar>
        <View>
          <Text className="font-semibold">Sarah Johnson</Text>
          <Text className="text-muted-foreground text-sm">CTO at TechCorp</Text>
        </View>
      </CardHeader>
      <CardContent>
        <Text className="text-lg italic leading-relaxed">
          "This library has completely transformed how we build user interfaces. The components are
          flexible, accessible, and easy to use."
        </Text>
      </CardContent>
    </Card>
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
  );
}
