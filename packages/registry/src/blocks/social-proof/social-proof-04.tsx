import { View, ScrollView } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function SocialProof04() {
  return (
    <View className="w-full py-10 bg-muted/30">
      <Text className="text-center text-sm font-medium text-muted-foreground mb-6 uppercase tracking-widest">
        Featured In
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full">
        <View className="flex-row gap-12 px-8 items-center">
            {["TechCrunch", "Forbes", "Wired", "The Verge", "Product Hunt", "Hacker News", "Bloomberg"].map((media, i) => (
                <Text key={i} className="text-2xl font-bold text-muted-foreground/60 whitespace-nowrap">
                    {media}
                </Text>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
