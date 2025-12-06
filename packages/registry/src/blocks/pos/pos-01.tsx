import * as React from 'react';
import { View } from 'react-native';
import { LayoutDashboard, ShoppingCart, Users, Settings, LogOut } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function Pos01() {
  return (
    <View className="flex-row h-[600px] w-full bg-background border rounded-lg overflow-hidden">
      {/* Sidebar */}
      <View className="w-20 border-r flex-col items-center py-4 gap-4 bg-muted/20">
        <View className="mb-4">
           <Avatar alt="Store Logo">
            <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
        </View>
        
        <Button variant="ghost" size="icon" className="bg-primary/10">
          <Icon as={LayoutDashboard} className="text-primary" />
        </Button>
        <Button variant="ghost" size="icon">
          <Icon as={ShoppingCart} className="text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <Icon as={Users} className="text-muted-foreground" />
        </Button>
        
        <View className="flex-1" />
        
        <Button variant="ghost" size="icon">
          <Icon as={Settings} className="text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Icon as={LogOut} className="text-destructive" />
        </Button>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold">Dashboard</Text>
            <Text className="text-muted-foreground">Welcome back, Cashier #1</Text>
          </View>
          <Text className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</Text>
        </View>
        <Separator className="mb-6" />
        <View className="flex-1 items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <Text className="text-muted-foreground">Main POS Area</Text>
        </View>
      </View>
    </View>
  );
}
