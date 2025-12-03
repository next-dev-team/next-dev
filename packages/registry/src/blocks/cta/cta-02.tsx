import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';

export function Cta02() {
  return (
    <View className="w-full max-w-4xl mx-auto p-6">
      <Card className="bg-primary text-primary-foreground border-0 overflow-hidden">
        <CardContent className="p-12 items-center text-center gap-8">
          <View className="gap-4">
            <Text className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Boost your productivity today.
            </Text>
            <Text className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Start using our tools and see the difference in your workflow immediately.
            </Text>
          </View>
          <Button size="lg" variant="secondary" className="min-w-[160px]">
            <Text>Sign Up Free</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
