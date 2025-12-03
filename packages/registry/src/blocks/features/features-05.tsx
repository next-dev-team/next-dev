import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Check } from 'lucide-react-native';

export function Features05() {
  return (
    <View className="w-full max-w-md mx-auto p-6">
      <Text className="text-2xl font-bold mb-6">Plan Includes</Text>
      <View className="gap-4">
        {[
            "Unlimited Projects",
            "Team Collaboration",
            "Advanced Analytics",
            "Custom Domain",
            "Priority Support",
            "SSO Integration",
            "Audit Logs",
            "SLA 99.99%"
        ].map((feature, i) => (
            <View key={i} className="flex-row items-center gap-3 border-b border-border/40 pb-4 last:border-0">
                <View className="h-6 w-6 rounded-full bg-primary/10 items-center justify-center">
                    <Icon as={Check} size={14} className="text-primary" />
                </View>
                <Text className="text-base font-medium">{feature}</Text>
            </View>
        ))}
      </View>
    </View>
  );
}
