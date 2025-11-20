import React from 'react';
import { View, DimensionValue } from 'react-native';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

export interface ProDescriptionsItem {
  label: React.ReactNode;
  children?: React.ReactNode;
  text?: React.ReactNode;
  span?: number;
  copyable?: boolean;
  valueType?:
    | 'text'
    | 'money'
    | 'date'
    | 'dateTime'
    | 'dateRange'
    | 'percent'
    | 'index'
    | 'indexBorder';
  valueEnum?: Record<string, { text: string; status?: string; color?: string }>;
}

export interface ProDescriptionsProps {
  items: ProDescriptionsItem[];
  title?: React.ReactNode;
  tooltip?: React.ReactNode;
  column?: number;
  layout?: 'horizontal' | 'vertical';
  bordered?: boolean;
  size?: 'default' | 'middle' | 'small';
  loading?: boolean;
  extra?: React.ReactNode;
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

    const key = (item as any).key;
    if (key && dataSource[key] !== undefined) {
      let value = dataSource[key];

      if (item.valueEnum && value !== undefined && value !== null) {
        const enumItem = item.valueEnum[String(value)];
        if (enumItem) {
          return (
            <View className="flex-row items-center gap-2">
              <Text className="text-sm">{enumItem.text}</Text>
              {enumItem.status && (
                <View
                  className={cn('h-2 w-2 rounded-full', enumItem.color && `bg-${enumItem.color}`)}
                />
              )}
            </View>
          );
        }
      }

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
    <View className={cn(bordered && 'rounded-lg border')}>
      {title && (
        <View
          className={cn(
            'flex-row items-center justify-between',
            paddingMap[size],
            bordered && 'border-b',
          )}
        >
          <View className="flex-row items-center gap-2">
            <Text variant="h3">{title}</Text>
            {tooltip && <View>{tooltip}</View>}
          </View>
          {extra && <View>{extra}</View>}
        </View>
      )}

      <View className={cn('flex-row flex-wrap', layout === 'vertical' && 'flex-col')}>
        {items.map((item, index) => {
          const span = item.span || 1;
          const flexBasis = `${(span / column) * 100}%`;
          const value = getValue(item);

          if (layout === 'vertical') {
            return (
              <View
                key={index}
                className={cn('flex-row', bordered && 'border-b last:border-b-0', paddingMap[size])}
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
              style={{ flexBasis: flexBasis as DimensionValue }}
              className={cn(bordered && 'border-b border-r', paddingMap[size])}
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