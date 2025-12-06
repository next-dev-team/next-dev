import * as React from 'react';
import { View } from 'react-native';
import { Delete } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Pos05() {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

  return (
    <View className="w-64 flex-row flex-wrap gap-2">
      <View className="w-full mb-4 p-4 bg-muted rounded-lg items-end">
        <Text className="text-3xl font-mono font-bold">$0.00</Text>
      </View>
      
      {keys.map((key) => (
        <Button
          key={key}
          variant={key === 'del' ? 'secondary' : 'outline'}
          className="w-[30%] h-16 grow items-center justify-center"
        >
          {key === 'del' ? (
            <Icon as={Delete} className="text-foreground" />
          ) : (
            <Text className="text-xl font-semibold">{key}</Text>
          )}
        </Button>
      ))}
      
      <Button className="w-full mt-2 h-14" size="lg">
        <Text>Enter</Text>
      </Button>
    </View>
  );
}