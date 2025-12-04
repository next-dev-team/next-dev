import { NAV_THEME } from '@rnr-expo/lib/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { LayoutGrid, type LucideIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/registry/new-york/components/ui/icon';

interface TabItemProps {
  icon: LucideIcon;
  label: string;
  color: string;
  focused: boolean;
  isDark: boolean;
}

function TabItem({ icon, label, color, focused, isDark }: TabItemProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        width: '100%',
      }}
    >
      {/* Rounded square icon container */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: focused
            ? isDark
              ? 'rgba(14, 165, 233, 0.15)'
              : 'rgba(8, 145, 178, 0.1)'
            : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: focused ? 1 : 0,
          borderColor: focused
            ? isDark
              ? 'rgba(14, 165, 233, 0.3)'
              : 'rgba(8, 145, 178, 0.2)'
            : 'transparent',
        }}
      >
        <Icon as={icon} size={20} style={{ color }} />
      </View>
      {/* Label */}
      <Text
        style={{
          fontSize: 10,
          marginTop: 3,
          fontWeight: focused ? '600' : '400',
          color: color,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          animation: 'shift',
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: Platform.OS === 'ios' ? 80 : 70,
            position: 'absolute',
            left: 40,
            right: 40,
            bottom: 20,
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          },
          tabBarBackground: () => (
            <View style={StyleSheet.absoluteFillObject}>
              {/* Frosted glass background */}
              <LinearGradient
                colors={
                  isDark
                    ? ['rgba(58, 58, 60, 0.8)', 'rgba(44, 44, 46, 0.9)']
                    : ['rgba(255, 255, 255, 0.8)', 'rgba(249, 249, 249, 0.9)']
                }
                style={[StyleSheet.absoluteFillObject, { borderRadius: 20 }]}
              />
              {/* Blur overlay for glass effect */}
              <BlurView
                intensity={100}
                tint={isDark ? 'dark' : 'light'}
                style={[StyleSheet.absoluteFillObject, { borderRadius: 20 }]}
              />
              {/* Subtle border */}
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                }}
              />
              {/* Inner highlight */}
              <View
                style={{
                  position: 'absolute',
                  top: 1,
                  left: 1,
                  right: 1,
                  height: 1,
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.4)',
                  borderTopLeftRadius: 19,
                  borderTopRightRadius: 19,
                }}
              />
            </View>
          ),
          tabBarActiveTintColor: isDark ? '#0ea5e9' : '#0891b2',
          tabBarInactiveTintColor: isDark ? 'rgba(142, 142, 147, 0.8)' : 'rgba(120, 120, 128, 0.8)',
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size, focused }) => (
              <TabItem
                icon={LayoutGrid}
                label="Counter"
                color={color}
                focused={focused}
                isDark={isDark}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
