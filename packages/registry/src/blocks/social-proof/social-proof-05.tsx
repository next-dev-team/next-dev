import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card } from '@/registry/new-york/components/ui/card';

export function SocialProof05() {
  return (
    <View className="mx-auto w-full max-w-4xl gap-8 p-6">
      <View className="items-center gap-2 text-center">
        <Text className="text-2xl font-bold">Integrates with your favorite tools</Text>
        <Text className="text-muted-foreground">
          Connect seamlessly with the platforms you use every day.
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-center gap-4">
        {['Slack', 'GitHub', 'Discord', 'Notion', 'Figma', 'Linear', 'Vercel', 'Supabase'].map(
          (tool, i) => (
            <Card
              key={i}
              className="bg-background hover:bg-muted/50 h-24 w-32 items-center justify-center transition-colors"
            >
              <Text className="font-semibold">{tool}</Text>
            </Card>
          ),
        )}
      </View>
    </View>
  );
}
