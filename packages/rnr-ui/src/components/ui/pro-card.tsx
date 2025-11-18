import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { cn } from '~/lib/utils';

export interface ProCardTabs {
  items: Array<{
    key: string;
    label: React.ReactNode;
    children?: React.ReactNode;
  }>;
  activeKey?: string;
  onChange?: (key: string) => void;
}

export interface ProCardProps {
  /**
   * Card title
   */
  title?: React.ReactNode;
  /**
   * Card description
   */
  description?: React.ReactNode;
  /**
   * Card extra content
   */
  extra?: React.ReactNode;
  /**
   * Card actions
   */
  actions?: React.ReactNode[];
  /**
   * Ghost mode - removes padding and background
   * @default false
   */
  ghost?: boolean;
  /**
   * Header bordered
   * @default false
   */
  headerBordered?: boolean;
  /**
   * Collapsed state (controlled)
   */
  collapsed?: boolean;
  /**
   * Collapsible
   * @default false
   */
  collapsible?: boolean;
  /**
   * Default collapsed state
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * On collapse handler
   */
  onCollapse?: (collapsed: boolean) => void;
  /**
   * Custom collapse icon render
   */
  collapsibleIconRender?: (props: { collapsed: boolean }) => React.ReactNode;
  /**
   * Tabs configuration
   */
  tabs?: ProCardTabs;
  /**
   * Card variant
   * @default 'outlined'
   */
  variant?: 'outlined' | 'borderless';
  /**
   * Split direction for nested cards
   */
  split?: 'vertical' | 'horizontal';
  /**
   * Column span for grid layout (1-24 or percentage)
   */
  colSpan?: number | string;
  /**
   * Direction for flex layout
   */
  direction?: 'row' | 'column';
  /**
   * Wrap support for nested cards
   * @default false
   */
  wrap?: boolean;
  /**
   * Card content
   */
  children?: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
}

function ProCard({
  title,
  description,
  extra,
  actions,
  ghost = false,
  headerBordered = false,
  collapsed: controlledCollapsed,
  collapsible = false,
  defaultCollapsed = false,
  onCollapse,
  collapsibleIconRender,
  tabs,
  variant = 'outlined',
  split,
  colSpan,
  direction,
  wrap = false,
  children,
  className,
}: ProCardProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<string | undefined>(tabs?.activeKey || tabs?.items[0]?.key);

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    onCollapse?.(newCollapsed);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    tabs?.onChange?.(key);
  };

  const activeTabContent = tabs?.items.find((item) => item.key === activeTab)?.children;

  const cardContent = (
    <Card
      className={cn(
        ghost && 'bg-transparent border-0 shadow-none p-0',
        variant === 'borderless' && 'border-0',
        headerBordered && 'border-b',
        className,
      )}
    >
      {(title || description || extra || collapsible || tabs) && (
        <CardHeader
          className={cn(
            'flex-row items-start justify-between',
            headerBordered && 'border-b pb-4',
            ghost && 'px-0',
          )}
        >
          <View className="flex-1">
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </View>
          <View className="flex-row items-center gap-2">
            {extra && <View>{extra}</View>}
            {collapsible && (
              <Pressable onPress={handleCollapse} className="active:opacity-70">
                {collapsibleIconRender ? (
                  collapsibleIconRender({ collapsed })
                ) : (
                  <Text className="text-lg">{collapsed ? '▼' : '▲'}</Text>
                )}
              </Pressable>
            )}
          </View>
        </CardHeader>
      )}

      {tabs && (
        <View className="border-border border-b">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {tabs.items.map((tab) => (
                <Pressable
                  key={tab.key}
                  onPress={() => handleTabChange(tab.key)}
                  className={cn(
                    'border-b-2 px-4 py-2',
                    activeTab === tab.key
                      ? 'border-primary'
                      : 'border-transparent',
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm font-medium',
                      activeTab === tab.key ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {!collapsed && (
        <CardContent className={cn(ghost && 'px-0')}>
          {tabs ? activeTabContent : children}
        </CardContent>
      )}

      {actions && actions.length > 0 && (
        <CardFooter className={cn('flex-row justify-end gap-2', ghost && 'px-0')}>
          {actions.map((action, index) => (
            <View key={index}>{action}</View>
          ))}
        </CardFooter>
      )}
    </Card>
  );

  // Handle grid layout with colSpan
  if (colSpan) {
    const spanStyle = typeof colSpan === 'number'
      ? { flex: colSpan / 24 }
      : { width: colSpan };

    return (
      <View style={spanStyle} className={cn(wrap && 'flex-wrap')}>
        {cardContent}
      </View>
    );
  }

  // Handle split layout
  if (split) {
    return (
      <View
        className={cn(
          'flex-row',
          split === 'vertical' ? 'flex-row' : 'flex-col',
        )}
      >
        {cardContent}
      </View>
    );
  }

  // Handle direction
  if (direction) {
    return (
      <View
        className={cn(
          'flex',
          direction === 'row' ? 'flex-row' : 'flex-col',
          wrap && 'flex-wrap',
        )}
      >
        {cardContent}
      </View>
    );
  }

  return cardContent;
}

// ProCard.Group for grouping cards
interface ProCardGroupProps {
  /**
   * Direction for group layout
   */
  direction?: 'row' | 'column';
  /**
   * Wrap support
   */
  wrap?: boolean;
  /**
   * Children cards
   */
  children: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
}

function ProCardGroup({ direction = 'row', wrap = false, children, className }: ProCardGroupProps) {
  return (
    <View
      className={cn(
        'flex gap-4',
        direction === 'row' ? 'flex-row' : 'flex-col',
        wrap && 'flex-wrap',
        className,
      )}
    >
      {children}
    </View>
  );
}

ProCard.Group = ProCardGroup;

export { ProCard, ProCardGroup };
export type { ProCardProps, ProCardTabs, ProCardGroupProps };

