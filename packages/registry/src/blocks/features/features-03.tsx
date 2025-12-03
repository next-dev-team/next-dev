import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';

export function Features03() {
  return (
    <View className="w-full max-w-5xl mx-auto p-6 gap-20">
      <View className="flex-col md:flex-row gap-10 items-center">
        <View className="flex-1 gap-4">
            <Text className="text-3xl font-bold">Analytics that matter</Text>
            <Text className="text-muted-foreground text-lg">
                Get deep insights into your user behavior with our advanced analytics dashboard.
            </Text>
            <View className="flex-row pt-2">
                <Button variant="outline">
                    <Text>View Dashboard</Text>
                </Button>
            </View>
        </View>
        <View className="flex-1 aspect-video bg-muted rounded-xl items-center justify-center">
             <Text className="text-muted-foreground">Analytics Preview</Text>
        </View>
      </View>

      <View className="flex-col md:flex-row-reverse gap-10 items-center">
        <View className="flex-1 gap-4">
            <Text className="text-3xl font-bold">Global Scale</Text>
            <Text className="text-muted-foreground text-lg">
                Deploy your application to the edge and reach users all around the world.
            </Text>
             <View className="flex-row pt-2">
                <Button variant="outline">
                    <Text>Learn about Edge</Text>
                </Button>
            </View>
        </View>
        <View className="flex-1 aspect-video bg-muted rounded-xl items-center justify-center">
             <Text className="text-muted-foreground">Map Preview</Text>
        </View>
      </View>
    </View>
  );
}
