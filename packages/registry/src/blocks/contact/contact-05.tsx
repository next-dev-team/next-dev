import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Input } from '@/registry/new-york/components/ui/input';
import { Textarea } from '@/registry/new-york/components/ui/textarea';
import { Button } from '@/registry/new-york/components/ui/button';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Mail, Phone } from 'lucide-react-native';

export function Contact05() {
  return (
    <View className="w-full max-w-5xl px-4 py-12 flex-col md:flex-row gap-12">
      <View className="flex-1 gap-6">
        <View>
            <Text className="text-3xl font-bold">Contact Sales</Text>
            <Text className="text-muted-foreground mt-2">
                Talk to our team about your enterprise needs.
            </Text>
        </View>
        <View className="gap-4">
            <View className="flex-row items-center gap-3">
                <Icon as={Mail} className="text-muted-foreground" size={20} />
                <Text>sales@example.com</Text>
            </View>
            <View className="flex-row items-center gap-3">
                <Icon as={Phone} className="text-muted-foreground" size={20} />
                <Text>+1 (555) 123-4567</Text>
            </View>
        </View>
      </View>
      <View className="flex-1 gap-4 bg-muted/30 p-6 rounded-xl">
        <Input placeholder="Work Email" />
        <Input placeholder="Company Name" />
        <Textarea placeholder="Tell us about your project" />
        <Button>
            <Text>Request Demo</Text>
        </Button>
      </View>
    </View>
  );
}