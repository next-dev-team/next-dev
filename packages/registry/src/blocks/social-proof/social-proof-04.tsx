import { View, ScrollView } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function SocialProof04() {
  return (
    <View className="bg-muted/30 w-full py-10">
      <Text className="text-muted-foreground mb-6 text-center text-sm font-medium uppercase tracking-widest">
        Featured In
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full">
        <View className="flex-row items-center gap-12 px-8">
          {[
            'TechCrunch',
            'Forbes',
            'Wired',
            'The Verge',
            'Product Hunt',
            'Hacker News',
            'Bloomberg',
          ].map((media, i) => (
            <Text key={i} className="text-muted-foreground/60 whitespace-nowrap text-2xl font-bold">
              {media}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
