import * as React from 'react';
import { View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function OrderSummary05() {
  return (
    <Card className="w-full max-w-md border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
      <CardHeader className="flex-row items-center gap-4 pb-2">
        <View className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-full">
           <Icon as={RefreshCw} size={20} className="text-orange-600 dark:text-orange-400" />
        </View>
        <CardTitle className="text-orange-900 dark:text-orange-100">Return Requested</CardTitle>
      </CardHeader>
      <CardContent>
        <Text className="text-orange-800 dark:text-orange-200 mb-4">
          We have received your return request for Order #1234. A shipping label has been sent to your email.
        </Text>
        <View className="bg-background/50 p-3 rounded border border-orange-200 dark:border-orange-900 mb-4">
          <Text className="text-xs text-muted-foreground uppercase font-bold mb-1">Status</Text>
          <Text className="font-medium">Waiting for package</Text>
        </View>
        <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-900/40">
          <Text>View Return Status</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
