import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Star } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials05() {
  return (
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
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
