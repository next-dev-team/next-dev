import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function SocialProof01() {
  return (
    <View className="w-full max-w-4xl mx-auto p-8 items-center gap-8">
      <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Trusted by industry leaders
      </Text>
      <View className="flex-row flex-wrap justify-center gap-8 md:gap-16 opacity-70">
        {["Acme Corp", "GlobalBank", "TechStart", "Nebula", "Oasis"].map((company, i) => (
            <Text key={i} className="text-xl font-bold text-muted-foreground">{company}</Text>
        ))}
      </View>
    </View>
  );
}
