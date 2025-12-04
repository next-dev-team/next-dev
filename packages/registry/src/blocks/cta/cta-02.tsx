import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';

export function Cta02() {
  return (
    <View className="mx-auto w-full max-w-4xl p-6">
      <Card className="bg-primary text-primary-foreground overflow-hidden border-0">
        <CardContent className="items-center gap-8 p-12 text-center">
          <View className="gap-4">
            <Text className="text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Boost your productivity today.
            </Text>
            <Text className="text-primary-foreground/80 mx-auto max-w-2xl text-lg">
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
