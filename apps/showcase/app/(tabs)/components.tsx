import { cn } from '@/registry/new-york/lib/utils';
import { Button } from '@/registry/new-york/components/ui/button';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import { useScrollToTop } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { COMPONENTS } from '@showcase/lib/constants';
import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { cssInterop, useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, View } from 'react-native';

cssInterop(FlashList, { className: 'style', contentContainerClassName: 'contentContainerStyle' });

export default function ComponentsScreen() {
  const { colorScheme } = useColorScheme();
  const [search, setSearch] = React.useState('');
  const [isAtTop, setIsAtTop] = React.useState(true);
  const isAtTopRef = React.useRef(true);
  const flashListRef = React.useRef(null);
  useScrollToTop(flashListRef);

  const data = !search
    ? COMPONENTS
    : COMPONENTS.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View
      className={cn(
        'web:p-4 mx-auto w-full max-w-lg flex-1',
        Platform.select({ android: cn('border-border/0 border-t', !isAtTop && 'border-border') })
      )}>
      <FlashList
        ref={flashListRef}
        data={data}
        onScroll={Platform.select({
          android: ({ nativeEvent }) => {
            const isScrollAtTop = nativeEvent.contentOffset.y <= 0;
            if (isScrollAtTop !== isAtTopRef.current) {
              isAtTopRef.current = isScrollAtTop;
              setIsAtTop(isScrollAtTop);
            }
          },
        })}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-4 pb-2 android:pb-24 ios:pb-28"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Platform.select({
          native: (
            <View className="pb-3">
              <Input
                placeholder="Search..."
                clearButtonMode="always"
                onChangeText={setSearch}
                autoCorrect={false}
              />
            </View>
          ),
          web: (
            <View className="pb-2">
              <Input
                placeholder="Search..."
                onChangeText={setSearch}
                autoCorrect={false}
              />
            </View>
          ),
        })}
        renderItem={({ item, index }) => (
          <Link href={`/components/${item.slug}`} asChild>
            <Link.Trigger>
              <Button
                variant="ghost"
                size="default"
                unstable_pressDelay={100}
                className={cn(
                  'flex-row justify-between px-3 py-2 mb-1 rounded-lg',
                  'hover:bg-accent active:bg-accent'
                )}>
                <Text className="text-sm font-medium">{item.name}</Text>
                <Icon as={ChevronRight} className="text-muted-foreground size-3.5 stroke-[1.5px]" />
              </Button>
            </Link.Trigger>
            <Link.Preview style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }} />
          </Link>
        )}
        ListFooterComponent={<View className="android:pb-safe h-2" />}
      />
    </View>
  );
}