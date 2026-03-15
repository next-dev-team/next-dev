import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { FancyButton } from '@next-dev/ui';
import { Link, Stack } from 'expo-router';
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import { Alert, Image, type ImageStyle, ScrollView, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  title: 'UniWind Todo',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { theme } = useUniwind();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView contentContainerClassName="flex-grow items-center justify-center gap-8 p-6 pt-24">
        <Image source={LOGO[theme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />

        <View className="gap-2 p-4">
          <Text className="text-center text-xl font-bold text-foreground">UniWind Todo Expo</Text>
          <Text className="text-center text-sm text-muted-foreground">
            Built with React Native Reusables + UniWind
          </Text>
        </View>

        {/* Fancy Button Showcase */}
        <View className="w-full max-w-sm gap-4">
          <Text className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            ✨ Fancy Button Variants
          </Text>

          <FancyButton
            variant="gradient"
            size="lg"
            label="🚀 Launch Todo"
            onPress={() => Alert.alert('Fancy!', 'Gradient button pressed!')}
          />

          <FancyButton
            variant="default"
            label="Add New Task"
            onPress={() => Alert.alert('Default', 'Default button pressed!')}
          />

          <FancyButton
            variant="destructive"
            label="Clear All Todos"
            onPress={() => Alert.alert('Destructive', 'Destructive button pressed!')}
          />

          <FancyButton
            variant="outline"
            label="Import Tasks"
            onPress={() => Alert.alert('Outline', 'Outline button pressed!')}
          />

          <FancyButton
            variant="ghost"
            label="Show Completed"
            onPress={() => Alert.alert('Ghost', 'Ghost button pressed!')}
          />

          <FancyButton variant="gradient" size="sm" label="Small Gradient" shimmer={false} />

          <FancyButton variant="gradient" disabled label="Disabled Gradient" />
        </View>

        {/* Original template links */}
        <View className="flex-row gap-2 pt-4">
          <Link href="https://reactnativereusables.com" asChild>
            <Button>
              <Text>Browse Docs</Text>
            </Button>
          </Link>
          <Link href="https://github.com/founded-labs/react-native-reusables" asChild>
            <Button variant="ghost">
              <Text>Star Repo</Text>
              <Icon as={StarIcon} />
            </Button>
          </Link>
        </View>
      </ScrollView>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { theme } = useUniwind();

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    Uniwind.setTheme(newTheme);
  }

  return (
    <Button
      onPressIn={toggleTheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 web:mx-4 rounded-full"
    >
      <Icon as={THEME_ICONS[theme ?? 'light']} className="size-5" />
    </Button>
  );
}
