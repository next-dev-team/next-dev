import React, { ReactNode } from 'react';
import { View, ViewStyle, ScrollView } from 'react-native';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Separator } from '@rnr/registry/src/new-york/components/ui/separator';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export interface BreadcrumbItem {
  title: string;
  path?: string;
  onPress?: () => void;
}

export interface PageContainerProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
  content?: ReactNode;
  breadcrumb?: {
    items?: BreadcrumbItem[];
    separator?: ReactNode;
  };
  loading?: boolean;
  header?: {
    title?: ReactNode;
    subTitle?: ReactNode;
    tags?: ReactNode;
    extra?: ReactNode;
    avatar?: ReactNode;
  };
  tabList?: Array<{
    key: string;
    tab: ReactNode;
  }>;
  tabActiveKey?: string;
  onTabChange?: (key: string) => void;
  footer?: ReactNode;
  fixedHeader?: boolean;
  affixedHeader?: boolean;
  ghost?: boolean;
  children?: ReactNode;
  className?: string;
  style?: ViewStyle;
}

/**
 * PageContainer - Professional page wrapper with header and breadcrumb
 * Provides consistent page layout across the application
 */
export function PageContainer({
  title,
  subTitle,
  extra,
  content,
  breadcrumb,
  loading = false,
  header,
  tabList,
  tabActiveKey,
  onTabChange,
  footer,
  fixedHeader = false,
  ghost = false,
  children,
  className,
  style,
}: PageContainerProps) {
  const renderBreadcrumb = () => {
    if (!breadcrumb?.items || breadcrumb.items.length === 0) return null;

    return (
      <View className="flex-row items-center mb-4">
        {breadcrumb.items.map((item, index) => (
          <View key={index} className="flex-row items-center">
            {index > 0 && (
              <Text className="mx-2 text-muted-foreground">
                {breadcrumb.separator || '/'}
              </Text>
            )}
            {item.onPress ? (
              <Button
                variant="link"
                onPress={item.onPress}
                className="p-0 h-auto"
              >
                <Text className="text-sm text-primary">{item.title}</Text>
              </Button>
            ) : (
              <Text
                className={cn(
                  'text-sm',
                  index === breadcrumb.items.length - 1
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {item.title}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderHeader = () => {
    const hasHeader = title || header || breadcrumb;
    if (!hasHeader) return null;

    return (
      <View className={cn('p-6', !ghost && 'bg-card border-b')}>
        {renderBreadcrumb()}

        {(title || header) && (
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="flex-row items-center gap-3 mb-2">
                {header?.avatar && <View>{header.avatar}</View>}
                <View className="flex-1">
                  <Text className="text-3xl font-bold">
                    {header?.title || title}
                  </Text>
                  {(header?.subTitle || subTitle) && (
                    <Text className="text-muted-foreground mt-1">
                      {header?.subTitle || subTitle}
                    </Text>
                  )}
                  {header?.tags && (
                    <View className="flex-row gap-2 mt-2">{header.tags}</View>
                  )}
                </View>
              </View>
            </View>
            
            {(extra || header?.extra) && (
              <View>{extra || header?.extra}</View>
            )}
          </View>
        )}

        {content && <View className="mt-4">{content}</View>}

        {tabList && tabList.length > 0 && (
          <View className="flex-row gap-4 mt-4 border-b">
            {tabList.map((tab) => (
              <Button
                key={tab.key}
                variant="ghost"
                onPress={() => onTabChange?.(tab.key)}
                className={cn(
                  'rounded-none border-b-2',
                  tabActiveKey === tab.key
                    ? 'border-primary'
                    : 'border-transparent'
                )}
              >
                <Text
                  className={cn(
                    tabActiveKey === tab.key
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {tab.tab}
                </Text>
              </Button>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-12">
          <Text className="text-muted-foreground">Loading...</Text>
        </View>
      );
    }

    return children;
  };

  return (
    <View className={cn('flex-1', !ghost && 'bg-background', className)} style={style}>
      {renderHeader()}
      
      <ScrollView
        className={cn('flex-1', !ghost && 'p-6')}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {renderContent()}
      </ScrollView>

      {footer && (
        <View className={cn('p-6', !ghost && 'border-t bg-card')}>
          {footer}
        </View>
      )}
    </View>
  );
}

