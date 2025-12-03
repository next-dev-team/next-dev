import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { CheckCircle2 } from 'lucide-react-native';

export function Features02() {
  return (
    <View className="w-full max-w-4xl mx-auto p-6 flex-row flex-wrap items-center gap-12">
      <View className="flex-1 min-w-[300px] gap-6">
        <Text className="text-3xl font-bold">Why choose us?</Text>
        <Text className="text-muted-foreground text-lg">
          We provide the best tools for your development workflow.
        </Text>
        
        <View className="gap-4">
            {["Real-time updates", "Unlimited storage", "24/7 Support", "Custom domains"].map((item, i) => (
                <View key={i} className="flex-row items-center gap-3">
                    <Icon as={CheckCircle2} size={20} className="text-primary" />
                    <Text className="text-lg font-medium">{item}</Text>
                </View>
            ))}
        </View>
      </View>
      
      <View className="flex-1 min-w-[300px] aspect-square bg-muted rounded-2xl items-center justify-center">
        <Text className="text-muted-foreground">Feature Image</Text>
      </View>
    </View>
  );
}
