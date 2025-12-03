import * as React from 'react';
import { View } from 'react-native';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

const teamMembers = [
  {
    name: 'Sofia Davis',
    role: 'Owner',
    initials: 'SD',
  },
  {
    name: 'Jackson Lee',
    role: 'Member',
    initials: 'JL',
  },
  {
    name: 'Isabella Nguyen',
    role: 'Member',
    initials: 'IN',
  },
];

export function Team01() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {teamMembers.map((member, index) => (
          <View key={index} className="flex-row items-center justify-between space-x-4">
            <View className="flex-row items-center space-x-4">
              <Avatar>
                <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
                <AvatarFallback>
                  <Text>{member.initials}</Text>
                </AvatarFallback>
              </Avatar>
              <View>
                <Text className="text-sm font-medium leading-none">{member.name}</Text>
                <Text className="text-sm text-muted-foreground">{member.role}</Text>
              </View>
            </View>
          </View>
        ))}
      </CardContent>
    </Card>
  );
}
