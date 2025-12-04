import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card } from '@/registry/new-york/components/ui/card';

export function SocialProof05() {
  return (
    <View className="w-full max-w-4xl mx-auto p-6 gap-8">
      <View className="items-center text-center gap-2">
        <Text className="text-2xl font-bold">Integrates with your favorite tools</Text>
        <Text className="text-muted-foreground">Connect seamlessly with the platforms you use every day.</Text>
      </View>
      
      <View className="flex-row flex-wrap justify-center gap-4">
        {["Slack", "GitHub", "Discord", "Notion", "Figma", "Linear", "Vercel", "Supabase"].map((tool, i) => (
            <Card key={i} className="w-32 h-24 items-center justify-center bg-background hover:bg-muted/50 transition-colors">
                <Text className="font-semibold">{tool}</Text>
            </Card>
        ))}
      </View>
    </View>
  );
}
