import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';

export function Features04() {
  return (
    <View className="w-full max-w-5xl mx-auto p-6 gap-6">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold">Powerful Tools</Text>
      </View>
      
      <View className="flex-col md:flex-row gap-6 h-auto md:h-[500px]">
        <Card className="flex-1 bg-primary/5 border-0">
            <CardHeader>
                <CardTitle>All-in-one Platform</CardTitle>
            </CardHeader>
            <CardContent>
                <Text className="text-muted-foreground">Manage everything from a single dashboard.</Text>
                <View className="mt-8 flex-1 bg-background rounded-lg h-40 border border-border/50" />
            </CardContent>
        </Card>
        
        <View className="flex-1 gap-6">
             <Card className="flex-1 bg-muted/50 border-0">
                <CardHeader>
                    <CardTitle>Real-time Sync</CardTitle>
                </CardHeader>
                 <CardContent>
                    <Text className="text-muted-foreground">Data updates instantly across devices.</Text>
                </CardContent>
            </Card>
             <Card className="flex-1 bg-muted/50 border-0">
                <CardHeader>
                    <CardTitle>Offline Support</CardTitle>
                </CardHeader>
                 <CardContent>
                    <Text className="text-muted-foreground">Keep working even without internet.</Text>
                </CardContent>
            </Card>
        </View>
      </View>
    </View>
  );
}
