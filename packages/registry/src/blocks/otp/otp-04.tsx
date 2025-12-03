import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';

export function Otp04() {
  return (
    <View className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardContent className="pt-6 gap-6">
            <View className="gap-2">
                <Text className="text-2xl font-bold">Two-factor Authentication</Text>
                <Text className="text-muted-foreground">
                Enter the code from your authenticator app.
                </Text>
            </View>

            <View className="gap-4">
                <View className="flex-row gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <View key={i} className="flex-1 aspect-square">
                            <Input 
                                className="w-full h-full text-center text-lg p-0" 
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

            <View className="flex-row justify-center items-center gap-2">
                <Text className="text-sm text-muted-foreground">Didn't receive the code?</Text>
                <Button variant="link" size="sm" className="h-auto p-0">
                    <Text>Resend</Text>
                </Button>
            </View>
        </CardContent>
      </Card>
    </View>
  );
}
