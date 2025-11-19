import { View, Text } from 'react-native';

export default function WelcomePage() {
  return (
    <View className="gap-4">
      <View className="rounded-lg border border-border p-4">
        <Text style={{ fontSize: 20, fontWeight: '600' }}>Welcome</Text>
        <Text className="text-muted-foreground mt-2">RNR Admin starter using ProLayout.</Text>
      </View>
    </View>
  );
}
