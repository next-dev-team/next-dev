<<<<<<< HEAD
import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/registry/new-york/components/ui/card';
import { Check } from 'lucide-react-native';

export function Features04() {
  return (
    <View className="w-full max-w-md gap-4">
      <View className="gap-2">
        <Text className="text-3xl font-bold">Features 04</Text>
        <Text className="text-muted-foreground">Discover what makes our product unique.</Text>
      </View>
      <View className="gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              <View className="bg-primary/10 h-10 w-10 items-center justify-center rounded-full">
                <Check className="text-primary" size={20} />
              </View>
              <View className="flex-1">
                <CardTitle>Feature {i}</CardTitle>
                <CardDescription>Description for feature {i}</CardDescription>
              </View>
            </CardHeader>
          </Card>
        ))}
=======
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
>>>>>>> 8df7a12469da125b66dc972df5aaa58a8df9bd00
      </View>
    </View>
  );
}
