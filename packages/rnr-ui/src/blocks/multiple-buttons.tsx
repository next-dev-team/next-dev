import { View } from 'react-native';
import { RedButton } from '@/rnr-ui/components/ui/red-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export function MultipleButtons() {
  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Multiple Buttons</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Multiple buttons with different variants
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <RedButton onPress={() => {}} label="Primary Red Button" />
            <RedButton variant="secondary" onPress={() => {}} label="Secondary Red Button" />
            <RedButton variant="outline" onPress={() => {}} label="Outline Red Button" />
            <RedButton variant="ghost" onPress={() => {}} label="Ghost Red Button" />
            <RedButton variant="link" onPress={() => {}} label="Red Button Link" />
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
