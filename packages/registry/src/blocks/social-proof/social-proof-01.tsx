import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function SocialProof01() {
  return (
    <View className="mx-auto w-full max-w-4xl items-center gap-8 p-8">
      <Text className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
        Trusted by industry leaders
      </Text>
      <View className="flex-row flex-wrap justify-center gap-8 opacity-70 md:gap-16">
        {['Acme Corp', 'GlobalBank', 'TechStart', 'Nebula', 'Oasis'].map((company, i) => (
          <Text key={i} className="text-muted-foreground text-xl font-bold">
            {company}
          </Text>
        ))}
      </View>
    </View>
  );
}
