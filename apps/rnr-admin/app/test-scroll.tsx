import { View, Text } from 'react-native';

export default function TestScrollPage() {
  return (
    <View className="flex-1">
      <Text className="text-2xl font-bold mb-4">Scroll Test Page</Text>
      <Text className="text-muted-foreground mb-8">This page tests scrolling functionality with lots of content.</Text>
      
      <View className="flex-1 border rounded-lg bg-card p-4">
        {Array.from({ length: 50 }, (_, i) => (
          <View key={i} className="mb-4 p-4 bg-background rounded-lg border">
            <Text className="font-semibold">Item {i + 1}</Text>
            <Text className="text-sm text-muted-foreground mt-1">
              This is test content item number {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}