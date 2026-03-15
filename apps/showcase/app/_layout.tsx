import '../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { HeaderRightView } from '@showcase/components/header-right-view';
import { Text } from '@showcase/components/ui/text';
import { useGeistFont } from '@showcase/hooks/use-geist-font';
import { NAV_THEME } from '@showcase/lib/theme';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [loaded, error] = useGeistFont();
  const { colorScheme } = useColorScheme();

  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: NAV_THEME[colorScheme].colors.background,
        }}>
        <Stack
          screenOptions={{
            headerBackTitle: 'Back',
            headerTitle(props) {
              return (
                <Text className="ios:font-medium android:mt-1.5 text-xl">
                  {toOptions(props.children.split('/').pop())}
                </Text>
              );
            },
            headerRight: () => <HeaderRightView />,
          }}>
          <Stack.Screen
            name="index"
            options={{
              headerLargeTitle: true,
              headerTitle: 'Showcase',
              headerLargeTitleShadowVisible: false,
              headerLargeStyle: {
                backgroundColor: colorScheme === 'dark' ? 'hsl(0 0% 3.9%)' : 'hsl(0 0% 100%)',
              },
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

function toOptions(name: string) {
  const title = name
    .split('-')
    .map((str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase()))
    .join(' ');
  return title;
}
