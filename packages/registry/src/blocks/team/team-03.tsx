import * as React from 'react';
import { View } from 'react-native';
import {
  Card,
  CardContent,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';
import { Button } from '@/registry/new-york/components/ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Team03() {
  return (
    <Card className="w-full max-w-sm flex-row items-center p-4 gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
        <AvatarFallback>
            <Text>CN</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1 gap-2">
        <View>
             <Text className="font-semibold text-lg">John Smith</Text>
             <Text className="text-sm text-muted-foreground">Lead Developer</Text>
        </View>
        <View className="flex-row gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8">
                <Icon as={Github} size={16} />
            </Button>
             <Button size="icon" variant="ghost" className="h-8 w-8">
                <Icon as={Twitter} size={16} />
            </Button>
             <Button size="icon" variant="ghost" className="h-8 w-8">
                <Icon as={Linkedin} size={16} />
            </Button>
        </View>
      </View>
    </Card>
  );
}
