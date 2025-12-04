<<<<<<< HEAD
import * as React from 'react';
import { View, Image } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader } from '@/registry/new-york/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials02() {
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
            <Text className="font-semibold">User Name 02</Text>
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
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Quote } from 'lucide-react-native';

export function Testimonials02() {
  return (
    <View className="mx-auto w-full max-w-md items-center gap-6 p-6 text-center">
      <View className="bg-primary/10 rounded-full p-3">
        <Icon as={Quote} size={24} className="text-primary" />
      </View>
      <Text className="text-xl font-medium leading-relaxed">
        "The flexibility and performance of these components are unmatched. It saved us weeks of
        development time."
      </Text>
      <View className="items-center gap-2">
        <Avatar className="h-12 w-12" alt="User Avatar">
          <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
          <AvatarFallback>
            <Text>JD</Text>
          </AvatarFallback>
        </Avatar>
        <View>
          <Text className="font-semibold">John Doe</Text>
          <Text className="text-muted-foreground text-sm">Senior Engineer</Text>
        </View>
      </View>
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
    </View>
  );
}
