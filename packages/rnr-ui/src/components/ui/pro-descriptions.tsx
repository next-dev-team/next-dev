import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

export interface ProDescriptionsItem {
  /**
   * Label text
   */
  label: React.ReactNode;
  /**
   * Value content
   */
  children?: React.ReactNode;
  /**
   * Value text (alternative to children)
   */
  text?: React.ReactNode;
  /**
   * Span (columns 1-24)
   * @default 1
   */
  span?: number;
  /**
   * Copyable
   * @default false
   */
  copyable?: boolean;
  /**
   * Value type
   */
  valueType?: 'text' | 'money' | 'date' | 'dateTime' | 'dateRange' | 'percent' | 'index' | 'indexBorder';
  /**
   * Value enum
   */
  valueEnum?: Record<string, { text: string; status?: string; color?: string }>;
}

export interface ProDescriptionsProps {
  /**
   * Description items
   */
  items: ProDescriptionsItem[];
  /**
   * Title
   */
  title?: React.ReactNode;
  /**
   * Tooltip
   */
  tooltip?: React.ReactNode;
  /**
   * Column count
   * @default 3
   */
  column?: number;
  /**
   * Layout: 'horizontal' | 'vertical'
   * @default 'horizontal'
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * Bordered
   * @default false
   */
  bordered?: boolean;
  /**
   * Size: 'default' | 'middle' | 'small'
   * @default 'default'
   */
  size?: 'default' | 'middle' | 'small';
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Extra content
   */
  extra?: React.ReactNode;
  /**
   * Data source
   */
  dataSource?: Record<string, any>;
}

function ProDescriptions({
  items,
  title,
  tooltip,
  column = 3,
  layout = 'horizontal',
  bordered = false,
  size = 'default',
  loading = false,
  extra,
  dataSource = {},
}: ProDescriptionsProps) {
  const getValue = (item: ProDescriptionsItem) => {
    if (item.children) {
      return item.children;
    }

    if (item.text !== undefined) {
      return item.text;
    }

    // Get value from dataSource if item has a key
    const key = (item as any).key;
    if (key && dataSource[key] !== undefined) {
      let value = dataSource[key];

      // Handle valueEnum
      if (item.valueEnum && value !== undefined && value !== null) {
        const enumItem = item.valueEnum[String(value)];
        if (enumItem) {
          return (
            <View className="flex-row items-center gap-2">
              <Text className="text-sm">{enumItem.text}</Text>
              {enumItem.status && (
                <View
                  className={cn(
                    'h-2 w-2 rounded-full',
                    enumItem.color && `bg-${enumItem.color}`,
                  )}
                />
              )}
            </View>
          );
        }
      }

      // Handle valueType
      if (item.valueType) {
        switch (item.valueType) {
          case 'money':
            return `¥${Number(value).toLocaleString()}`;
          case 'percent':
            return `${Number(value) * 100}%`;
          case 'index':
            return `#${value}`;
          case 'indexBorder':
            return (
              <View className="bg-primary/10 border-primary h-6 w-6 items-center justify-center rounded-full border">
                <Text className="text-primary text-xs">{value}</Text>
              </View>
            );
          default:
            return String(value);
        }
      }

      return String(value);
    }

    return null;
  };

  const paddingMap = {
    default: 'p-4',
    middle: 'p-3',
    small: 'p-2',
  };

  if (loading) {
    return (
      <View className="gap-4">
        {title && (
          <View className="flex-row items-center justify-between">
            <Text variant="h3">{title}</Text>
            {extra && <View>{extra}</View>}
          </View>
        )}
        <View className="gap-2">
          {Array.from({ length: column * 2 }).map((_, index) => (
            <View key={index} className="bg-muted h-4 animate-pulse rounded" />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className={cn(bordered && 'border rounded-lg')}>
      {title && (
        <View className={cn('flex-row items-center justify-between', paddingMap[size], bordered && 'border-b')}>
          <View className="flex-row items-center gap-2">
            <Text variant="h3">{title}</Text>
            {tooltip && <View>{tooltip}</View>}
          </View>
          {extra && <View>{extra}</View>}
        </View>
      )}

      <View
        className={cn(
          'flex-row flex-wrap',
          layout === 'vertical' && 'flex-col',
        )}
      >
        {items.map((item, index) => {
          const span = item.span || 1;
          const flexBasis = `${(span / column) * 100}%`;
          const value = getValue(item);

          if (layout === 'vertical') {
            return (
              <View
                key={index}
                className={cn(
                  'flex-row',
                  bordered && 'border-b last:border-b-0',
                  paddingMap[size],
                )}
              >
                <View className="w-32">
                  <Text className="text-muted-foreground text-sm font-medium">{item.label}</Text>
                </View>
                <View className="flex-1">
                  {value ? (
                    <Text className="text-sm">{value}</Text>
                  ) : (
                    <Text className="text-muted-foreground text-sm">-</Text>
                  )}
                </View>
              </View>
            );
          }

          return (
            <View
              key={index}
              style={{ flexBasis }}
              className={cn(
                bordered && 'border-r border-b',
                paddingMap[size],
              )}
            >
              <View className="mb-1">
                <Text className="text-muted-foreground text-sm font-medium">{item.label}</Text>
              </View>
              <View>
                {value ? (
                  <Text className="text-sm">{value}</Text>
                ) : (
                  <Text className="text-muted-foreground text-sm">-</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export { ProDescriptions };
export type { ProDescriptionsProps, ProDescriptionsItem };

