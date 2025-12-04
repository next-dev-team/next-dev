import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Mail, MapPin, Phone } from 'lucide-react-native';

export function Contact03() {
  return (
    <View className="w-full max-w-5xl px-4 py-12">
      <View className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="items-center">
            <View className="p-3 bg-muted rounded-full mb-2">
                <Icon as={Mail} className="text-primary" />
            </View>
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent className="items-center">
            <Text className="text-muted-foreground">hello@example.com</Text>
            <Text className="text-muted-foreground">support@example.com</Text>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="items-center">
             <View className="p-3 bg-muted rounded-full mb-2">
                <Icon as={Phone} className="text-primary" />
            </View>
            <CardTitle>Phone</CardTitle>
          </CardHeader>
          <CardContent className="items-center">
            <Text className="text-muted-foreground">+1 (555) 000-0000</Text>
            <Text className="text-muted-foreground">+1 (555) 000-0001</Text>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="items-center">
             <View className="p-3 bg-muted rounded-full mb-2">
                <Icon as={MapPin} className="text-primary" />
            </View>
            <CardTitle>Office</CardTitle>
          </CardHeader>
          <CardContent className="items-center text-center">
            <Text className="text-muted-foreground">1234 Street Name, City</Text>
            <Text className="text-muted-foreground">Country, 10000</Text>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}