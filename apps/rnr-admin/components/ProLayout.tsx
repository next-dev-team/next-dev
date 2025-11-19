import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Pressable, useWindowDimensions, Text } from 'react-native';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react-native';

export interface MenuItem {
  path?: string;
  name: string;
  icon?: React.ReactNode;
  routes?: MenuItem[];
  disabled?: boolean;
}

export interface RouteItem {
  path?: string;
  name?: string;
  icon?: React.ReactNode;
  routes?: RouteItem[];
}

export interface ProLayoutProps {
  title?: React.ReactNode;
  logo?: React.ReactNode | (() => React.ReactNode);
  menuDataRender?: () => MenuItem[];
  route?: RouteItem;
  menuHeaderRender?: React.ReactNode | ((logo: React.ReactNode, title: React.ReactNode) => React.ReactNode);
  menuFooterRender?: (menuProps: any) => React.ReactNode;
  menuExtraRender?: (menuProps: any) => React.ReactNode;
  onMenuHeaderClick?: (e: any) => void;
  navTheme?: 'light' | 'dark';
  layout?: 'side' | 'top' | 'mix';
  fixSiderbar?: boolean;
  contentWidth?: 'Fluid' | 'Fixed';
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  collapsedButtonRender?: boolean | ((collapsed: boolean) => React.ReactNode);
  headerContentRender?: () => React.ReactNode;
  rightContentRender?: () => React.ReactNode;
  headerTitleRender?: (logo: React.ReactNode, title: React.ReactNode, props: any) => React.ReactNode;
  loading?: boolean;
  pure?: boolean;
  children: React.ReactNode;
  location?: { pathname?: string };
  selectedKeys?: string[];
  onMenuClick?: (item: MenuItem) => void;
  onRouteChange?: (pathname: string) => void;
}

function ProLayout({
  title = 'Admin',
  logo,
  menuDataRender,
  route,
  menuHeaderRender,
  menuFooterRender,
  menuExtraRender,
  onMenuHeaderClick,
  layout = 'side',
  navTheme = 'light',
  fixSiderbar = true,
  contentWidth = 'Fluid',
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapse,
  collapsedButtonRender = true,
  headerContentRender,
  rightContentRender,
  loading = false,
  pure = false,
  children,
  location,
  selectedKeys,
  onMenuClick,
  onRouteChange,
}: ProLayoutProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(location?.pathname);
  const { width } = useWindowDimensions();

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    onCollapse?.(newCollapsed);
  };

  const menuData = useMemo(() => {
    if (menuDataRender) return menuDataRender() || [];
    const transform = (item?: RouteItem): MenuItem[] => {
      if (!item) return [];
      const children = item.routes || [];
      return children.map((c) => ({
        path: c.path,
        name: c.name || c.path || '',
        icon: c.icon,
        routes: transform(c as RouteItem),
      }));
    };
    return transform(route);
  }, [menuDataRender, route]);

  const breadcrumbs = useMemo(() => {
    const stack: MenuItem[] = [];
    const walk = (items: MenuItem[], target?: string): boolean => {
      for (const it of items) {
        stack.push(it);
        if (it.path === target) return true;
        if (it.routes && walk(it.routes, target)) return true;
        stack.pop();
      }
      return false;
    };
    if (selectedKey) {
      walk(menuData, selectedKey);
    }
    return [...stack];
  }, [menuData, selectedKey]);

  useEffect(() => {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(width < 768);
    }
  }, [width, controlledCollapsed]);

  useEffect(() => {
    if (selectedKeys && selectedKeys.length > 0) {
      setSelectedKey(selectedKeys[0]);
    }
  }, [selectedKeys]);

  const renderLogo = () => {
    if (typeof logo === 'function') {
      return logo();
    }
    return logo || null;
  };

  const renderMenuHeader = () => {
    if (menuHeaderRender === false) {
      return null;
    }
    if (typeof menuHeaderRender === 'function') {
      return menuHeaderRender(renderLogo(), title);
    }
    if (menuHeaderRender) {
      return menuHeaderRender;
    }
    return (
      <Pressable onPress={onMenuHeaderClick} className="flex-row items-center gap-3 p-4">
        {renderLogo() && <View>{renderLogo()}</View>}
        {!collapsed && (
          <View>
            <Text className="text-base font-semibold">{String(title)}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0): React.ReactNode => {
    const isSelected = selectedKey === item.path;
    const hasChildren = item.routes && item.routes.length > 0;
    return (
      <View key={item.path || item.name} className={level > 0 ? 'ml-4' : undefined}>
        <Pressable
          onPress={() => {
            if (!item.disabled) {
              setSelectedKey(item.path);
              onMenuClick?.(item);
              if (item.path) onRouteChange?.(item.path);
            }
          }}
          className={isSelected ? 'flex-row items-center gap-2 rounded-md px-3 py-2 bg-primary/10' : 'flex-row items-center gap-2 rounded-md px-3 py-2 hover:bg-muted'}
        >
          {item.icon && <View>{item.icon}</View>}
          {!collapsed && (
            <Text className={isSelected ? 'text-sm font-semibold' : 'text-sm'}>{item.name}</Text>
          )}
          {hasChildren && !collapsed && (
            <View className="ml-auto">
              <ChevronDown size={14} />
            </View>
          )}
        </Pressable>
        {hasChildren && !collapsed && (
          <View className="mt-1">
            {item.routes!.map((child) => renderMenuItem(child, level + 1))}
          </View>
        )}
      </View>
    );
  };

  const renderSidebar = () => {
    if (layout === 'top') return null;
    return (
      <View className={fixSiderbar ? (collapsed ? 'bg-card border-border border-r fixed left-0 top-0 bottom-0 z-10 w-16' : 'bg-card border-border border-r fixed left-0 top-0 bottom-0 z-10 w-64') : (collapsed ? 'bg-card border-border border-r w-16' : 'bg-card border-border border-r w-64')}>
        {renderMenuHeader()}
        {menuExtraRender && <View className="px-4 pb-4">{menuExtraRender({ collapsed })}</View>}
        <ScrollView className="flex-1">
          <View className="gap-1 p-2">
            {menuData.map((item) => renderMenuItem(item))}
          </View>
        </ScrollView>
        {menuFooterRender && <View className="border-border border-t p-4">{menuFooterRender({ collapsed })}</View>}
        {collapsedButtonRender && (
          <View className="border-border border-t p-2">
            {typeof collapsedButtonRender === 'function' ? (
              collapsedButtonRender(collapsed)
            ) : (
              <Pressable onPress={handleCollapse} className="w-full items-center rounded-md px-2 py-2">
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Pressable>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderTopMenu = () => {
    if (layout !== 'top' && layout !== 'mix') return null;
    return (
      <View className={navTheme === 'dark' ? 'border-border border-b bg-muted' : 'border-border border-b bg-card'}>
        <View className="flex-row items-center justify-between px-4 h-14">
          <View className="flex-row items-center gap-3">
            {layout !== 'top' && (
              <Pressable onPress={handleCollapse} className="rounded-md px-2 py-1">
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Pressable>
            )}
            <Pressable onPress={onMenuHeaderClick} className="flex-row items-center gap-3">
              {renderLogo() && <View>{renderLogo()}</View>}
              <Text className="text-base font-semibold">{String(title)}</Text>
            </Pressable>
          </View>
          {layout === 'top' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-1">
                {menuData.map((item) => renderMenuItem(item))}
              </View>
            </ScrollView>
          )}
          <View className="flex-row items-center gap-2">
            {headerContentRender && <View>{headerContentRender()}</View>}
            {rightContentRender && <View>{rightContentRender()}</View>}
          </View>
        </View>
        {breadcrumbs.length > 0 && (
          <View className="flex-row items-center gap-2 px-4 pb-2">
            {breadcrumbs.map((b, i) => (
              <View key={(b.path || b.name || '') + i} className="flex-row items-center gap-2">
                <Text className="text-xs text-muted-foreground">{b.name}</Text>
                {i < breadcrumbs.length - 1 && <Text className="text-xs text-muted-foreground">›</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (pure) return <>{children}</>;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <View>Loading...</View>
      </View>
    );
  }

  const contentWrapper = contentWidth === 'Fixed' ? 'max-w-[1200px] mx-auto w-full' : 'w-full';
  return (
    <View className="flex-1 flex-row bg-background" style={{ height: '100%' }}>
      {renderSidebar()}
      <View className="flex-1 flex-col">
        {renderTopMenu()}
        <View 
          className={layout !== 'top' && fixSiderbar ? (collapsed ? 'flex-1 ml-16' : 'flex-1 ml-64') : 'flex-1'} 
          style={{ flex: 1, overflow: 'hidden' }}
        >
          <ScrollView 
            className={`${contentWrapper} p-6`} 
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
          >
            <View style={{ minHeight: '100%' }}>
              {children}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export { ProLayout };