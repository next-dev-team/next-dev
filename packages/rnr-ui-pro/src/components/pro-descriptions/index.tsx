import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { Card } from '@rnr/registry/src/new-york/components/ui/card';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Separator } from '@rnr/registry/src/new-york/components/ui/separator';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export interface ProDescriptionsItem<T = any> {
  label: ReactNode;
  dataIndex?: keyof T;
  span?: number;
  render?: (value: any, record: T) => ReactNode;
  valueType?: 'text' | 'date' | 'dateTime' | 'time' | 'money' | 'percent';
  copyable?: boolean;
  ellipsis?: boolean;
}

export interface ProDescriptionsProps<T = any> {
  title?: ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  column?: number | { xs?: number; sm?: number; md?: number; lg?: number };
  size?: 'small' | 'default' | 'large';
  layout?: 'horizontal' | 'vertical';
  colon?: boolean;
  labelStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  dataSource?: T;
  items?: ProDescriptionsItem<T>[];
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
}

/**
 * ProDescriptions - Advanced description list component
 * Perfect for displaying detailed information in a structured format
 */
export function ProDescriptions<T extends Record<string, any>>({
  title,
  extra,
  bordered = false,
  column = 3,
  size = 'default',
  layout = 'horizontal',
  colon = true,
  labelStyle,
  contentStyle,
  dataSource,
  items = [],
  loading = false,
  className,
  style,
}: ProDescriptionsProps<T>) {
  const sizeMap = {
    small: { padding: 'p-2', text: 'text-sm' },
    default: { padding: 'p-3', text: 'text-base' },
    large: { padding: 'p-4', text: 'text-lg' },
  };

  const currentSize = sizeMap[size];
  const columnsCount = typeof column === 'number' ? column : column.md || 3;

  const formatValue = (item: ProDescriptionsItem<T>, value: any): ReactNode => {
    if (value === null || value === undefined) return '-';

    switch (item.valueType) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'dateTime':
        return new Date(value).toLocaleString();
      case 'time':
        return new Date(value).toLocaleTimeString();
      case 'money':
        return `$${Number(value).toFixed(2)}`;
      case 'percent':
        return `${Number(value).toFixed(2)}%`;
      default:
        return String(value);
    }
  };

  const renderItem = (item: ProDescriptionsItem<T>, index: number) => {
    if (!dataSource) return null;

    const value = item.dataIndex ? dataSource[item.dataIndex] : undefined;
    const displayValue = item.render
      ? item.render(value, dataSource)
      : formatValue(item, value);

    const span = item.span || 1;
    const isLastInRow = (index + 1) % columnsCount === 0;

    if (layout === 'vertical') {
      return (
        <View
          key={index}
          className={cn(
            'flex-col',
            bordered && 'border-b',
            currentSize.padding
          )}
          style={{ flex: span }}
        >
          <Text
            className={cn(
              'font-medium mb-2',
              currentSize.text,
              'text-muted-foreground'
            )}
            style={labelStyle}
          >
            {item.label}
            {colon && ':'}
          </Text>
          <Text className={currentSize.text} style={contentStyle}>
            {displayValue}
          </Text>
        </View>
      );
    }

    return (
      <View
        key={index}
        className={cn(
          'flex-row',
          bordered && 'border-b border-r',
          !isLastInRow && !bordered && 'border-r',
          currentSize.padding
        )}
        style={{ flex: span }}
      >
        <View
          className={cn(
            'flex-1 mr-4',
            bordered && 'bg-muted/30'
          )}
          style={labelStyle}
        >
          <Text
            className={cn(
              'font-medium',
              currentSize.text,
              'text-muted-foreground'
            )}
          >
            {item.label}
            {colon && ':'}
          </Text>
        </View>
        <View className="flex-2" style={contentStyle}>
          <Text className={currentSize.text}>{displayValue}</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    if (!title && !extra) return null;

    return (
      <>
        <View className="flex-row justify-between items-center p-4">
          {title && (
            <Text className="text-xl font-bold">{title}</Text>
          )}
          {extra && <View>{extra}</View>}
        </View>
        <Separator />
      </>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="py-12 items-center">
          <Text className="text-muted-foreground">Loading...</Text>
        </View>
      );
    }

    if (!dataSource || items.length === 0) {
      return (
        <View className="py-12 items-center">
          <Text className="text-muted-foreground">No data</Text>
        </View>
      );
    }

    // Group items into rows based on column count
    const rows: ProDescriptionsItem<T>[][] = [];
    let currentRow: ProDescriptionsItem<T>[] = [];
    let currentSpan = 0;

    items.forEach((item) => {
      const span = item.span || 1;
      if (currentSpan + span > columnsCount) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [item];
        currentSpan = span;
      } else {
        currentRow.push(item);
        currentSpan += span;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return (
      <View className={bordered ? 'border' : ''}>
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            className={cn(
              'flex-row',
              layout === 'vertical' && 'flex-col'
            )}
          >
            {row.map((item, itemIndex) => 
              renderItem(item, rowIndex * columnsCount + itemIndex)
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Card className={cn('w-full', className)} style={style}>
      {renderHeader()}
      {renderContent()}
    </Card>
  );
}

// Type helper for creating items with better type inference
export function createDescriptionsItems<T>(
  items: ProDescriptionsItem<T>[]
): ProDescriptionsItem<T>[] {
  return items;
}

