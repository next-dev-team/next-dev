import { View, Text } from 'react-native';

export default function DashboardPage() {
  return (
    <View className="p-2">
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Dashboard</Text>
      <Text className="text-muted-foreground">Overview widgets go here.</Text>
    </View>
  );
}
