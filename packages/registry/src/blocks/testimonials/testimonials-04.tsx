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
    </View>
  );
}
