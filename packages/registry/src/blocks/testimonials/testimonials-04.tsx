<<<<<<< HEAD
import * as React from 'react';
import { View, Image } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader } from '@/registry/new-york/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials04() {
  return (
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
            <Text className="font-semibold">User Name 04</Text>
            <Text className="text-sm text-muted-foreground">@username</Text>
          </View>
        </CardHeader>
        <CardContent>
          <Text>
            "This library has saved me so much time. The components are beautiful and easy to use. Highly recommended!"
          </Text>
        </CardContent>
      </Card>
=======
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Star } from 'lucide-react-native';

export function Testimonials04() {
  return (
    <View className="w-full max-w-4xl mx-auto p-12 items-center text-center bg-muted/30 rounded-2xl">
      <View className="flex-row gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
            <Icon key={i} as={Star} size={20} className="text-yellow-500 fill-yellow-500" />
        ))}
      </View>
      <Text className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
        "The best decision we made this year was adopting this platform. It's simply game-changing."
      </Text>
      <View>
        <Text className="text-lg font-semibold">Emily Parker</Text>
        <Text className="text-muted-foreground">VP of Engineering, Acme Inc.</Text>
      </View>
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
    </View>
  );
}
