import * as React from 'react';
import { View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';
import { Button } from '@/registry/new-york/components/ui/button';
import { Mail, Phone } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Team04() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Contact Info</CardTitle>
      </CardHeader>
      <CardContent className="gap-6">
        <View className="flex-row items-center gap-4">
          <Avatar>
            <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
            <AvatarFallback>
              <Text>AB</Text>
            </AvatarFallback>
          </Avatar>
          <View>
            <Text className="font-medium">Alice Brown</Text>
            <Text className="text-muted-foreground text-sm">HR Manager</Text>
          </View>
        </View>
        <View className="gap-2">
          <Button variant="outline" className="justify-start gap-2">
            <Icon as={Mail} size={16} />
            <Text>alice@example.com</Text>
          </Button>
          <Button variant="outline" className="justify-start gap-2">
            <Icon as={Phone} size={16} />
            <Text>+1 (555) 000-0000</Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}
