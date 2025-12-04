import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Input } from '@/registry/new-york/components/ui/input';

export function Cta04() {
  return (
    <View className="w-full max-w-2xl mx-auto p-12 items-center text-center gap-8">
      <View className="gap-2">
        <Text className="text-2xl font-bold sm:text-3xl">
          Subscribe to our newsletter
        </Text>
        <Text className="text-muted-foreground">
          Get the latest updates, articles, and resources sent to your inbox weekly.
        </Text>
      </View>
      <View className="w-full max-w-md flex-row gap-2">
        <Input placeholder="Enter your email" className="flex-1 bg-background" />
        <Button>
          <Text>Subscribe</Text>
        </Button>
      </View>
      <Text className="text-xs text-muted-foreground">
        We respect your privacy. Unsubscribe at any time.
      </Text>
    </View>
  );
}
