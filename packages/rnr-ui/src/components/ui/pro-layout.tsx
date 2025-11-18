import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Pressable, Platform, useWindowDimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

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
  /**
   * Layout title
   * @default 'Ant Design Pro'
   */
  title?: React.ReactNode;
  /**
   * Logo component or URL
   */
  logo?: React.ReactNode | (() => React.ReactNode);
  /**
   * Menu data
   */
  menuDataRender?: () => MenuItem[];
  route?: RouteItem;
  /**
   * Menu header render function
   */
  menuHeaderRender?: React.ReactNode | ((logo: React.ReactNode, title: React.ReactNode) => React.ReactNode);
  /**
   * Menu footer render function
   */
  menuFooterRender?: (menuProps: any) => React.ReactNode;
  /**
   * Menu extra render function
   */
  menuExtraRender?: (menuProps: any) => React.ReactNode;
  /**
   * On menu header click handler
   */
  onMenuHeaderClick?: (e: any) => void;
  navTheme?: 'light' | 'dark';
  layout?: 'side' | 'top' | 'mix';
  /**
   * Fixed header
   * @default false
   */
  fixedHeader?: boolean;
  /**
   * Fixed sidebar
   * @default false
   */
  fixSiderbar?: boolean;
  /**
   * Content width: 'Fluid' or 'Fixed'
   * @default 'Fluid'
   */
  contentWidth?: 'Fluid' | 'Fixed';
  /**
   * Collapsed state (controlled)
   */
  collapsed?: boolean;
  /**
   * Default collapsed state
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * On collapse change handler
   */
  onCollapse?: (collapsed: boolean) => void;
  /**
   * Show collapsed button
   * @default true
   */
  collapsedButtonRender?: boolean | ((collapsed: boolean) => React.ReactNode);
  /**
   * Header actions
   */
  headerContentRender?: () => React.ReactNode;
  rightContentRender?: () => React.ReactNode;
  /**
   * Header title render
   */
  headerTitleRender?: (logo: React.ReactNode, title: React.ReactNode, props: any) => React.ReactNode;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Pure mode - removes all self-contained interfaces
   * @default false
   */
  pure?: boolean;
  /**
   * Children content
   */
  children: React.ReactNode;
  /**
   * Current location/pathname
   */
  location?: { pathname?: string };
  selectedKeys?: string[];
  /**
   * On menu item click
   */
  onMenuClick?: (item: MenuItem) => void;
  onRouteChange?: (pathname: string) => void;
  breadcrumbRender?: (routes: RouteItem[], pathname?: string) => React.ReactNode;
  autoCollapseThreshold?: number;
}

function ProLayout({
  title = 'Ant Design Pro',
  logo,
  menuDataRender,
  route,
  menuHeaderRender,
  menuFooterRender,
  menuExtraRender,
  onMenuHeaderClick,
  layout = 'side',
  navTheme = 'light',
  fixedHeader = false,
  fixSiderbar = false,
  contentWidth = 'Fluid',
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapse,
  collapsedButtonRender = true,
  headerContentRender,
  rightContentRender,
  headerTitleRender,
  loading = false,
  pure = false,
  children,
  location,
  selectedKeys,
  onMenuClick,
  onRouteChange,
  breadcrumbRender,
  autoCollapseThreshold = 768,
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

  useEffect(() => {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(width < autoCollapseThreshold);
    }
  }, [width, autoCollapseThreshold, controlledCollapsed]);

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
      <Pressable
        onPress={onMenuHeaderClick}
        className={cn('flex-row items-center gap-3 p-4', onMenuHeaderClick && 'active:opacity-70')}
      >
        {renderLogo() && <View>{renderLogo()}</View>}
        {!collapsed && (
          <Text variant="h4" className="font-semibold">
            {title}
          </Text>
        )}
      </Pressable>
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0): React.ReactNode => {
    const isSelected = selectedKey === item.path;
    const hasChildren = item.routes && item.routes.length > 0;

    return (
      <View key={item.path || item.name} className={cn(level > 0 && 'ml-4')}>
        <Pressable
          onPress={() => {
            if (!item.disabled) {
              setSelectedKey(item.path);
              onMenuClick?.(item);
              if (item.path) onRouteChange?.(item.path);
            }
          }}
          disabled={item.disabled}
          className={cn(
            'flex-row items-center gap-2 rounded-md px-3 py-2',
            isSelected && 'bg-primary/10',
            !item.disabled && 'active:bg-accent',
            item.disabled && 'opacity-50',
          )}
        >
          {item.icon && <View>{item.icon}</View>}
          {!collapsed && (
            <Text className={cn('text-sm', isSelected && 'font-semibold text-primary')}>
              {item.name}
            </Text>
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
    if (layout === 'top') {
      return null;
    }

    return (
      <View
        className={cn(
          'bg-card border-border border-r',
          fixSiderbar && 'fixed left-0 top-0 bottom-0 z-10',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {renderMenuHeader()}
        {menuExtraRender && (
          <View className="px-4 pb-4">{menuExtraRender({ collapsed })}</View>
        )}
        <ScrollView className="flex-1">
          <View className="gap-1 p-2">
            {menuData.map((item) => renderMenuItem(item))}
          </View>
        </ScrollView>
        {menuFooterRender && (
          <View className="border-border border-t p-4">{menuFooterRender({ collapsed })}</View>
        )}
        {collapsedButtonRender && (
          <View className="border-border border-t p-2">
            {typeof collapsedButtonRender === 'function' ? (
              collapsedButtonRender(collapsed)
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onPress={handleCollapse}
                className="w-full"
              >
                {collapsed ? '→' : '←'}
              </Button>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderTopMenu = () => {
    if (layout !== 'top' && layout !== 'mix') {
      return null;
    }

    return (
      <View className={cn('border-border border-b', navTheme === 'dark' ? 'bg-muted' : 'bg-card')}>
        <View className={cn('flex-row items-center justify-between px-4', fixedHeader && 'fixed top-0 left-0 right-0 z-10')}>
          <Pressable
            onPress={onMenuHeaderClick}
            className={cn('flex-row items-center gap-3 py-4', onMenuHeaderClick && 'active:opacity-70')}
          >
            {renderLogo() && <View>{renderLogo()}</View>}
            <Text variant="h4" className="font-semibold">
              {title}
            </Text>
          </Pressable>
          {layout === 'top' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-1">
                {menuData.map((item) => renderMenuItem(item))}
              </View>
            </ScrollView>
          )}
          {headerContentRender && <View>{headerContentRender()}</View>}
          {rightContentRender && <View>{rightContentRender()}</View>}
        </View>
      </View>
    );
  };

  const currentPath = selectedKey || location?.pathname;

  const buildBreadcrumb = useMemo(() => {
    const result: RouteItem[] = [];
    const dfs = (node?: RouteItem, trail: RouteItem[] = []) => {
      if (!node) return false;
      const nextTrail = node.path ? [...trail, node] : trail;
      if (node.path && node.path === currentPath) {
        result.push(...nextTrail);
        return true;
      }
      for (const child of node.routes || []) {
        if (dfs(child, nextTrail)) return true;
      }
      return false;
    };
    dfs(route, []);
    return result;
  }, [route, currentPath]);

  const renderBreadcrumbBar = () => {
    if (!route && !breadcrumbRender) return null;
    if (breadcrumbRender) return <View className="border-border border-b px-4 py-2">{breadcrumbRender(buildBreadcrumb, currentPath)}</View>;
    if (buildBreadcrumb.length === 0) return null;
    return (
      <View className="border-border border-b px-4 py-2">
        <View className="flex-row flex-wrap items-center gap-1">
          {buildBreadcrumb.map((node, idx) => (
            <View key={(node.path || node.name || '') + idx} className="flex-row items-center">
              <Text className="text-sm">
                {node.name || node.path || ''}
              </Text>
              {idx < buildBreadcrumb.length - 1 && <Text className="mx-1 text-muted-foreground">/</Text>}
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (pure) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 flex-row bg-background">
      {renderSidebar()}
      <View className="flex-1 flex-col">
        {renderTopMenu()}
        {renderBreadcrumbBar()}
        <View
          className={cn(
            'flex-1',
            layout !== 'top' && fixSiderbar && (collapsed ? 'ml-16' : 'ml-64'),
            layout === 'top' && fixedHeader && 'mt-16',
            contentWidth === 'Fixed' && 'max-w-7xl mx-auto w-full',
          )}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

export { ProLayout };
export type { ProLayoutProps, MenuItem, RouteItem };

