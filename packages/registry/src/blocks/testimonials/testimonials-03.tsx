import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader } from '@/registry/new-york/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials03() {
  return (
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
    </View>
  );
}
