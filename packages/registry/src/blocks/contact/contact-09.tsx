import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { LifeBuoy, MessageCircle } from 'lucide-react-native';

export function Contact09() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="grid md:grid-cols-2 gap-6">
        <View className="p-6 border rounded-xl gap-4 items-start">
            <Icon as={MessageCircle} size={32} className="text-primary" />
            <View>
                <Text className="font-bold text-lg">Chat to sales</Text>
                <Text className="text-muted-foreground">Speak to our friendly team.</Text>
            </View>
            <Button variant="outline">
                <Text>Start Chat</Text>
            </Button>
        </View>
        <View className="p-6 border rounded-xl gap-4 items-start">
            <Icon as={LifeBuoy} size={32} className="text-primary" />
             <View>
                <Text className="font-bold text-lg">Help & Support</Text>
                <Text className="text-muted-foreground">Check our help center.</Text>
            </View>
            <Button variant="outline">
                <Text>Visit Help Center</Text>
            </Button>
        </View>
      </View>
    </View>
  );
}