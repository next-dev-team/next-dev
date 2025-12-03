import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader } from '@/registry/new-york/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Testimonials01() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <Avatar alt="Sarah Johnson">
          <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
          <AvatarFallback asChild>
            <Text>CN</Text>
          </AvatarFallback>
        </Avatar>
        <View>
          <Text className="font-semibold">Sarah Johnson</Text>
          <Text className="text-muted-foreground text-sm">CTO at TechCorp</Text>
        </View>
      </CardHeader>
      <CardContent>
        <Text className="text-lg italic leading-relaxed">
          "This library has completely transformed how we build user interfaces. The components are
          flexible, accessible, and easy to use."
        </Text>
      </CardContent>
    </Card>
  );
}
