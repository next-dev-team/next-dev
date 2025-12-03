import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Zap, Shield, Smartphone } from 'lucide-react-native';

export function Features01() {
  return (
    <View className="w-full max-w-6xl mx-auto p-6 gap-10">
      <View className="gap-4 items-center text-center">
        <Text className="text-3xl font-bold">Key Features</Text>
        <Text className="text-muted-foreground text-lg max-w-2xl text-center">
          Everything you need to build modern applications.
        </Text>
      </View>
      
      <View className="flex-row flex-wrap justify-center gap-8">
        {[
            { icon: Zap, title: "Fast Performance", desc: "Optimized for speed and efficiency across all devices." },
            { icon: Shield, title: "Secure by Default", desc: "Enterprise-grade security built into every component." },
            { icon: Smartphone, title: "Mobile First", desc: "Designed with a mobile-first approach for better UX." },
        ].map((feature, i) => (
            <View key={i} className="w-full md:w-[30%] p-6 bg-card rounded-xl border gap-4">
                <View className="h-12 w-12 bg-primary/10 rounded-lg items-center justify-center">
                    <Icon as={feature.icon} size={24} className="text-primary" />
                </View>
                <Text className="text-xl font-bold">{feature.title}</Text>
                <Text className="text-muted-foreground">{feature.desc}</Text>
            </View>
        ))}
      </View>
    </View>
  );
}
