import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';

export function Otp04() {
  return (
    <View className="mx-auto w-full max-w-md p-4">
      <Card>
        <CardContent className="gap-6 pt-6">
          <View className="gap-2">
            <Text className="text-2xl font-bold">Two-factor Authentication</Text>
            <Text className="text-muted-foreground">
              Enter the code from your authenticator app.
            </Text>
          </View>

          <View className="gap-4">
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} className="aspect-square flex-1">
                  <Input
                    className="h-full w-full p-0 text-center text-lg"
                    keyboardType="number-pad"
                    maxLength={1}
                  />
                </View>
              ))}
            </View>

            <Button className="w-full">
              <Text>Confirm</Text>
            </Button>
          </View>

          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-muted-foreground text-sm">Didn't receive the code?</Text>
            <Button variant="link" size="sm" className="h-auto p-0">
              <Text>Resend</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
