import * as React from 'react';
import { View } from 'react-native';
import { CreditCard, Banknote, Wallet } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Pos08() {
  return (
    <View className="flex-row gap-4 p-4 w-full max-w-md">
        <Button variant="outline" className="flex-1 h-24 flex-col gap-2">
            <Icon as={CreditCard} size={24} className="text-foreground" />
            <Text>Card</Text>
        </Button>
        <Button variant="outline" className="flex-1 h-24 flex-col gap-2">
            <Icon as={Banknote} size={24} className="text-foreground" />
            <Text>Cash</Text>
        </Button>
        <Button variant="outline" className="flex-1 h-24 flex-col gap-2">
            <Icon as={Wallet} size={24} className="text-foreground" />
            <Text>Wallet</Text>
        </Button>
    </View>
  );
}