import * as React from 'react';
import { View } from 'react-native';
import { ChevronDown, ArrowUpDown } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/new-york/components/ui/dropdown-menu';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ShopUi03() {
  const [selected, setSelected] = React.useState('Featured');

  return (
    <View className="flex-row items-center justify-end p-4">
      <Text className="mr-2 text-sm text-muted-foreground">Sort by:</Text>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex-row items-center gap-2">
            <Text>{selected}</Text>
            <Icon as={ChevronDown} size={16} className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onPress={() => setSelected('Featured')}>
              <Text>Featured</Text>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => setSelected('Newest')}>
              <Text>Newest</Text>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => setSelected('Price: Low to High')}>
              <Text>Price: Low to High</Text>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => setSelected('Price: High to Low')}>
              <Text>Price: High to Low</Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
}