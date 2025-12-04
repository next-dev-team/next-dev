<<<<<<< HEAD
import * as React from 'react';
import { View, Image } from 'react-native';
=======
import { View } from 'react-native';
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader } from '@/registry/new-york/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials03() {
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
            <Text className="font-semibold">User Name 03</Text>
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
    <View className="mx-auto w-full max-w-5xl gap-6 p-6">
      <Text className="mb-4 text-center text-2xl font-bold">What our users say</Text>
      <View className="flex-row flex-wrap justify-center gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full md:w-[300px]">
            <CardHeader className="flex-row items-center gap-4">
              <Avatar alt={`User ${i}`}>
                <AvatarImage source={{ uri: `https://i.pravatar.cc/150?u=${i}` }} />
                <AvatarFallback>
                  <Text>U{i}</Text>
                </AvatarFallback>
              </Avatar>
              <View>
                <Text className="font-semibold">User {i}</Text>
                <Text className="text-muted-foreground text-xs">Verified Buyer</Text>
              </View>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground text-sm">
                "Amazing product! It really helped me streamline my workflow. Highly recommended to
                everyone."
              </Text>
            </CardContent>
          </Card>
        ))}
      </View>
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
    </View>
  );
}
