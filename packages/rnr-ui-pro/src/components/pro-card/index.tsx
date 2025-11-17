import React, { ReactNode, useState } from 'react';
import { View, ViewStyle, Pressable } from 'react-native';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@rnr/registry/src/new-york/components/ui/card';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@rnr/registry/src/new-york/components/ui/tabs';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export interface ProCardProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
  headerBordered?: boolean;
  bordered?: boolean;
  loading?: boolean;
  hoverable?: boolean;
  ghost?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  tabs?: {
    tabList?: Array<{
      key: string;
      tab: ReactNode;
      disabled?: boolean;
    }>;
    activeKey?: string;
    defaultActiveKey?: string;
    onChange?: (key: string) => void;
    tabBarExtraContent?: ReactNode;
  };
  actions?: ReactNode[];
  children?: ReactNode;
  className?: string;
  style?: ViewStyle;
  bodyStyle?: ViewStyle;
  headStyle?: ViewStyle;
  split?: 'vertical' | 'horizontal';
}

/**
 * ProCard - Advanced card component with tabs, actions, and collapsible support
 * Inspired by Ant Design Pro's ProCard
 */
export function ProCard({
  title,
  subTitle,
  extra,
  headerBordered = false,
  bordered = true,
  loading = false,
  hoverable = false,
  ghost = false,
  collapsible = false,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapse,
  tabs,
  actions,
  children,
  className,
  style,
  bodyStyle,
  headStyle,
  split,
}: ProCardProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [activeTabKey, setActiveTabKey] = useState(
    tabs?.activeKey || tabs?.defaultActiveKey || tabs?.tabList?.[0]?.key || ''
  );

  const collapsed = controlledCollapsed ?? internalCollapsed;

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    setInternalCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    tabs?.onChange?.(key);
  };

  const renderHeader = () => {
    if (!title && !subTitle && !extra && !tabs) return null;

    return (
      <CardHeader
        className={cn(
          headerBordered && 'border-b',
          'flex-row justify-between items-start'
        )}
        style={headStyle}
      >
        <View className="flex-1">
          {title && (
            <CardTitle className="flex-row items-center gap-2">
              {title}
              {collapsible && (
                <Pressable onPress={handleCollapse}>
                  <Text className="text-muted-foreground text-sm">
                    {collapsed ? '▶' : '▼'}
                  </Text>
                </Pressable>
              )}
            </CardTitle>
          )}
          {subTitle && <CardDescription>{subTitle}</CardDescription>}
        </View>
        {extra && <View>{extra}</View>}
      </CardHeader>
    );
  };

  const renderTabs = () => {
    if (!tabs?.tabList) return null;

    return (
      <View className="px-4 pt-4">
        <Tabs
          value={activeTabKey}
          onValueChange={handleTabChange}
        >
          <View className="flex-row justify-between items-center">
            <TabsList>
              {tabs.tabList.map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  disabled={tab.disabled}
                >
                  <Text>{tab.tab}</Text>
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.tabBarExtraContent && (
              <View>{tabs.tabBarExtraContent}</View>
            )}
          </View>

          {tabs.tabList.map((tab) => (
            <TabsContent key={tab.key} value={tab.key}>
              {activeTabKey === tab.key && children}
            </TabsContent>
          ))}
        </Tabs>
      </View>
    );
  };

  const renderContent = () => {
    if (collapsed) return null;

    if (tabs?.tabList) {
      return renderTabs();
    }

    return (
      <CardContent
        className={cn(
          split === 'vertical' && 'flex-row gap-4',
          split === 'horizontal' && 'flex-col gap-4'
        )}
        style={bodyStyle}
      >
        {loading ? (
          <View className="py-8 items-center">
            <Text className="text-muted-foreground">Loading...</Text>
          </View>
        ) : (
          children
        )}
      </CardContent>
    );
  };

  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    return (
      <CardFooter className="border-t">
        <View className="flex-row gap-2 flex-wrap">
          {actions.map((action, index) => (
            <View key={index} className="flex-1 min-w-[100px]">
              {action}
            </View>
          ))}
        </View>
      </CardFooter>
    );
  };

  if (ghost) {
    return (
      <View className={cn('w-full', className)} style={style}>
        {renderHeader()}
        {renderContent()}
        {renderActions()}
      </View>
    );
  }

  return (
    <Card
      className={cn(
        !bordered && 'border-0 shadow-none',
        hoverable && 'hover:shadow-md transition-shadow',
        className
      )}
      style={style}
    >
      {renderHeader()}
      {renderContent()}
      {renderActions()}
    </Card>
  );
}

