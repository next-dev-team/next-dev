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
    </View>
  );
}
