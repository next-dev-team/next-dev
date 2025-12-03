import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';

export function SocialProof02() {
  return (
    <View className="w-full max-w-5xl mx-auto p-6">
      <Card className="bg-primary text-primary-foreground border-0">
        <CardContent className="flex-col md:flex-row justify-around p-8 gap-8">
            {[
                { label: "Active Users", value: "100K+" },
                { label: "Countries", value: "150+" },
                { label: "Transactions", value: "$2B+" },
                { label: "Uptime", value: "99.99%" },
            ].map((stat, i) => (
                <View key={i} className="items-center gap-1">
                    <Text className="text-4xl font-bold text-primary-foreground">{stat.value}</Text>
                    <Text className="text-primary-foreground/80 font-medium">{stat.label}</Text>
                </View>
            ))}
        </CardContent>
      </Card>
    </View>
  );
}
