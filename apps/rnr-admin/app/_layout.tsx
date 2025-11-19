import '../global.css';

import { Platform } from 'react-native';
import { ProLayout } from '@admin/components/ProLayout';
import type { RouteItem } from '@admin/components/ProLayout';
import { Slot, usePathname, useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
// simplified controls without registry deps
import { Globe, Home, Users, Settings, ListPlus } from 'lucide-react-native';
import { PortalHost } from '@rn-primitives/portal';
import * as React from 'react';
import { useAuth, AuthProvider } from '@admin/components/AuthContext';

const route: RouteItem = {
  routes: [
    { path: '/dashboard', name: 'Dashboard', icon: <Home size={16} /> },
    {
      path: '/users',
      name: 'Users',
      icon: <Users size={16} />,
      routes: [
        { path: '/users/list', name: 'List', icon: <ListPlus size={16} /> },
        { path: '/users/create', name: 'Create' },
      ],
    },
    { path: '/test-scroll', name: 'Scroll Test', icon: <Settings size={16} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={16} /> },
  ],
};

function HeaderRight() {
  const [lang, setLang] = React.useState<'en' | 'th' | 'vi'>('en');
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();
  const router = useRouter();
  return (
    <View className="relative flex-row items-center gap-3">
      <Pressable className="flex-row items-center gap-2 rounded-md px-2 py-1" onPress={() => setLang(lang === 'en' ? 'th' : lang === 'th' ? 'vi' : 'en')}>
        <Globe size={16} />
        <Text style={{ fontSize: 12 }}>{lang.toUpperCase()}</Text>
      </Pressable>

      <Pressable className="flex-row items-center gap-2 rounded-md px-2 py-1" onPress={() => setOpen(!open)}>
        <Text style={{ fontSize: 12 }}>{user ? user.email : 'Profile'}</Text>
      </Pressable>

      {open && (
        <View className="absolute right-0 top-full mt-2 w-40 rounded-md border bg-background shadow-sm">
          <Pressable className="px-3 py-2" onPress={() => { setOpen(false); router.push('/sign-in'); }}>
            <Text style={{ fontSize: 12 }}>Sign in</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Logo() {
  return (
    <View className="flex-row items-center gap-2">
      <Globe size={18} />
      <Text className="text-base font-semibold">RNR Admin</Text>
    </View>
  );
}

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const containerStyle = Platform.OS === 'web' 
    ? { flex: 1, height: '100%' as const, overflow: 'scroll' as const }
    : { flex: 1, height: '100%' as const };

  return (
    <AuthProvider>
    <View style={containerStyle}>
      <ProLayout
        title="RNR Admin"
        route={route}
        layout="mix"
        navTheme="light"
        contentWidth="Fixed"
        fixSiderbar
        headerContentRender={() => (
          <Pressable className="rounded-md bg-muted px-2 py-1">
            <Text style={{ fontSize: 12 }}>New</Text>
          </Pressable>
        )}
        rightContentRender={() => <HeaderRight />}
        location={{ pathname }}
        onRouteChange={(p) => router.push(p)}
        menuHeaderRender={() => <Logo />}
      >
        <Slot />
      </ProLayout>
      <PortalHost />
    </View>
    </AuthProvider>
  );
}
