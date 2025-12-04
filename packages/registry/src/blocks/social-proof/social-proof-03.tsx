import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Star } from 'lucide-react-native';

export function SocialProof03() {
  return (
    <View className="mx-auto w-full max-w-md items-center gap-4 p-6">
      <View className="flex-row justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Avatar
            key={i}
            alt={`User ${i}`}
            className="border-background -ml-3 h-10 w-10 border-2 first:ml-0"
          >
            <AvatarImage source={{ uri: `https://i.pravatar.cc/150?u=${i + 10}` }} />
            <AvatarFallback>
              <Text>U{i}</Text>
            </AvatarFallback>
          </Avatar>
        ))}
      </View>
      <View className="items-center gap-1">
        <View className="flex-row gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Icon key={i} as={Star} size={16} className="fill-yellow-500 text-yellow-500" />
          ))}
        </View>
        <Text className="text-muted-foreground text-sm">
          Loved by <Text className="text-foreground font-bold">5,000+</Text> developers
        </Text>
      </View>
    </View>
  );
}
