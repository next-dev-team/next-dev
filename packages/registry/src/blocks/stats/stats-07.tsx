import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Progress } from '@/registry/new-york/components/ui/progress';

export function Stats07() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="w-full max-w-md px-4 py-12 gap-6">
      <Text className="text-2xl font-bold mb-4">Goal Progress</Text>
      <View className="gap-2">
        <View className="flex-row justify-between text-sm">
            <Text>Monthly Target</Text>
            <Text className="font-bold">66%</Text>
        </View>
        <Progress value={progress} className="w-full" />
      </View>
       <View className="gap-2">
        <View className="flex-row justify-between text-sm">
            <Text>Annual Target</Text>
            <Text className="font-bold">45%</Text>
        </View>
        <Progress value={45} className="w-full" />
      </View>
    </View>
  );
}