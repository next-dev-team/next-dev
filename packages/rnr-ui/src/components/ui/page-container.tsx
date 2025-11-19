import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export interface BreadcrumbRoute {
  path?: string;
  breadcrumbName?: string;
  children?: BreadcrumbRoute[];
}

export interface BreadcrumbProps {
  routes?: BreadcrumbRoute[];
}

export interface WaterMarkProps {
  content?: string;
  fontSize?: number;
  gap?: number;
  color?: string;
  rotate?: number;
  opacity?: number;
}

export interface PageHeaderProps {
  backIcon?: React.ReactNode;
  onBack?: () => void;
  avatar?: React.ReactNode;
  tags?: React.ReactNode[];
}

export interface PageContainerTabItem {
  key: string;
  tab: React.ReactNode;
}

export interface PageContainerProps {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
  content?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  header?: PageHeaderProps;
  breadcrumb?: BreadcrumbProps;
  breadcrumbRender?: (props: PageContainerProps) => React.ReactNode;
  waterMarkProps?: WaterMarkProps;
  tabList?: PageContainerTabItem[];
  tabActiveKey?: string;
  onTabChange?: (key: string) => void;
}

function PageContainer({
  title,
  subTitle,
  extra,
  content,
  children,
  footer,
  loading,
  header,
  breadcrumb,
  breadcrumbRender,
  waterMarkProps,
  tabList,
  tabActiveKey: controlledTabKey,
  onTabChange,
}: PageContainerProps) {
  const { width } = useWindowDimensions();
  const [internalTabKey, setInternalTabKey] = useState(tabList?.[0]?.key);
  const tabActiveKey = controlledTabKey ?? internalTabKey;

  const renderBreadcrumb = () => {
    if (breadcrumbRender)
      return (
        <View className="border-border border-b px-4 py-2">
          {breadcrumbRender({
            title,
            subTitle,
            extra,
            content,
            children,
            footer,
            loading,
            header,
            breadcrumb,
            waterMarkProps,
            tabList,
            tabActiveKey: tabActiveKey,
            onTabChange,
          })}
        </View>
      );
    const routes = breadcrumb?.routes || [];
    if (routes.length === 0) return null;
    return (
      <View className="border-border border-b px-4 py-2">
        <View className="flex-row flex-wrap items-center gap-1">
          {routes.map((r, i) => (
            <View key={(r.path || r.breadcrumbName || '') + i} className="flex-row items-center">
              <Text className="text-sm">{r.breadcrumbName || r.path || ''}</Text>
              {i < routes.length - 1 && <Text className="text-muted-foreground mx-1">/</Text>}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    const hasHeader =
      title ||
      subTitle ||
      extra ||
      header?.avatar ||
      (header?.tags && header?.tags.length > 0) ||
      header?.backIcon;
    if (!hasHeader) return null;
    return (
      <View className="border-border border-b px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {header?.backIcon && (
              <Pressable onPress={header.onBack} className="active:opacity-70">
                <View>{header.backIcon}</View>
              </Pressable>
            )}
            {header?.avatar && <View>{header.avatar}</View>}
            <View>
              {title && (
                <Text variant="h3" className="font-semibold">
                  {title}
                </Text>
              )}
              {subTitle && <Text className="text-muted-foreground text-sm">{subTitle}</Text>}
            </View>
          </View>
          {extra && <View className="flex-row gap-2">{extra}</View>}
        </View>
        {header?.tags && header.tags.length > 0 && (
          <View className="mt-2 flex-row flex-wrap gap-2">
            {header.tags.map((t, i) => (
              <View key={i}>{t}</View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderTabs = () => {
    if (!tabList || tabList.length === 0) return null;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="border-border flex-row items-center gap-1 border-b px-2">
          {tabList.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => {
                if (controlledTabKey === undefined) setInternalTabKey(tab.key);
                onTabChange?.(tab.key);
              }}
              className={cn(
                'rounded-md px-3 py-2',
                tabActiveKey === tab.key ? 'bg-primary/10' : 'active:bg-muted',
              )}
            >
              <View>{tab.tab}</View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    );
  };

  const Watermark = () => {
    const wm = waterMarkProps;
    if (!wm || !wm.content) return null;
    const gap = wm.gap ?? 160;
    const rows = Math.ceil(800 / gap);
    const cols = Math.ceil(width / gap);
    return (
      <View pointerEvents="none" className="absolute inset-0">
        {Array.from({ length: rows }).map((_, r) => (
          <View
            key={r}
            style={{ flexDirection: 'row', transform: [{ rotate: `${wm.rotate ?? -20}deg` }] }}
          >
            {Array.from({ length: cols }).map((__, c) => (
              <View
                key={c}
                style={{ width: gap, height: gap, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text
                  style={{
                    fontSize: wm.fontSize ?? 14,
                    color: wm.color ?? '#999',
                    opacity: wm.opacity ?? 0.25,
                  }}
                >
                  {wm.content}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const isLoading = !!loading;

  return (
    <View className="relative">
      {isLoading && (
        <View className="bg-background/50 absolute inset-0 z-10 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}
      {renderBreadcrumb()}
      {renderHeader()}
      {renderTabs()}
      {content && <View className="px-4 py-4">{content}</View>}
      <View className="px-4 py-4">{children}</View>
      {footer && <View className="border-border border-t px-4 py-3">{footer}</View>}
      <Watermark />
    </View>
  );
}

export { PageContainer };
export type {
  PageContainerProps,
  BreadcrumbProps,
  BreadcrumbRoute,
  WaterMarkProps,
  PageHeaderProps,
  PageContainerTabItem,
};
