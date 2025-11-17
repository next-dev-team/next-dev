import React, { ReactNode } from 'react';
import { View, ViewStyle, FlatList, FlatListProps, Pressable } from 'react-native';
import { Card } from '@rnr/registry/src/new-york/components/ui/card';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Separator } from '@rnr/registry/src/new-york/components/ui/separator';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export interface ProListMeta {
  title?: ReactNode;
  subTitle?: ReactNode;
  description?: ReactNode;
  avatar?: ReactNode;
  actions?: ReactNode[];
}

export interface ProListProps<T = any> extends Omit<FlatListProps<T>, 'renderItem' | 'data'> {
  dataSource?: T[];
  loading?: boolean;
  grid?: {
    gutter?: number;
    column?: number;
  };
  split?: boolean;
  size?: 'small' | 'default' | 'large';
  header?: ReactNode;
  footer?: ReactNode;
  bordered?: boolean;
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
    onChange?: (page: number, pageSize?: number) => void;
    showSizeChanger?: boolean;
  };
  renderItem?: (item: T, index: number) => ReactNode;
  metas?: {
    title?: {
      dataIndex?: keyof T;
      render?: (text: any, item: T, index: number) => ReactNode;
    };
    subTitle?: {
      dataIndex?: keyof T;
      render?: (text: any, item: T, index: number) => ReactNode;
    };
    description?: {
      dataIndex?: keyof T;
      render?: (text: any, item: T, index: number) => ReactNode;
    };
    avatar?: {
      dataIndex?: keyof T;
      render?: (text: any, item: T, index: number) => ReactNode;
    };
    actions?: {
      render?: (item: T, index: number) => ReactNode[];
    };
  };
  className?: string;
  style?: ViewStyle;
}

/**
 * ProList - Advanced list component with metadata and actions
 * Supports grid layout, pagination, and custom rendering
 */
export function ProList<T = any>({
  dataSource = [],
  loading = false,
  grid,
  split = true,
  size = 'default',
  header,
  footer,
  bordered = true,
  pagination,
  renderItem,
  metas,
  className,
  style,
  ...flatListProps
}: ProListProps<T>) {
  const sizeMap = {
    small: 'py-2',
    default: 'py-3',
    large: 'py-4',
  };

  const defaultRenderItem = (item: T, index: number): ReactNode => {
    if (renderItem) {
      return renderItem(item, index);
    }

    const title = metas?.title?.render
      ? metas.title.render(
          metas.title.dataIndex ? item[metas.title.dataIndex] : item,
          item,
          index
        )
      : metas?.title?.dataIndex
        ? String(item[metas.title.dataIndex])
        : null;

    const subTitle = metas?.subTitle?.render
      ? metas.subTitle.render(
          metas.subTitle.dataIndex ? item[metas.subTitle.dataIndex] : item,
          item,
          index
        )
      : metas?.subTitle?.dataIndex
        ? String(item[metas.subTitle.dataIndex])
        : null;

    const description = metas?.description?.render
      ? metas.description.render(
          metas.description.dataIndex ? item[metas.description.dataIndex] : item,
          item,
          index
        )
      : metas?.description?.dataIndex
        ? String(item[metas.description.dataIndex])
        : null;

    const avatar = metas?.avatar?.render
      ? metas.avatar.render(
          metas.avatar.dataIndex ? item[metas.avatar.dataIndex] : item,
          item,
          index
        )
      : null;

    const actions = metas?.actions?.render?.(item, index) || [];

    return (
      <View
        className={cn(
          'flex-row gap-3 px-4',
          sizeMap[size]
        )}
      >
        {avatar && <View>{avatar}</View>}
        
        <View className="flex-1">
          {(title || subTitle) && (
            <View className="flex-row items-center gap-2 mb-1">
              {title && (
                <Text className="font-semibold">{title}</Text>
              )}
              {subTitle && (
                <Text className="text-sm text-muted-foreground">{subTitle}</Text>
              )}
            </View>
          )}
          
          {description && (
            <Text className="text-sm text-muted-foreground">{description}</Text>
          )}
        </View>

        {actions.length > 0 && (
          <View className="flex-row gap-2">
            {actions.map((action, idx) => (
              <View key={idx}>{action}</View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const {
      current = 1,
      pageSize = 10,
      total = dataSource.length,
      onChange,
    } = pagination;

    const totalPages = Math.ceil(total / pageSize);

    return (
      <View className="flex-row justify-center items-center gap-2 p-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onPress={() => onChange?.(current - 1, pageSize)}
          disabled={current === 1}
        >
          <Text>Previous</Text>
        </Button>

        <Text className="text-sm">
          Page {current} of {totalPages}
        </Text>

        <Button
          variant="outline"
          size="sm"
          onPress={() => onChange?.(current + 1, pageSize)}
          disabled={current === totalPages}
        >
          <Text>Next</Text>
        </Button>
      </View>
    );
  };

  if (loading) {
    return (
      <Card className={cn(bordered && 'border', className)} style={style}>
        <View className="py-12 items-center">
          <Text className="text-muted-foreground">Loading...</Text>
        </View>
      </Card>
    );
  }

  const Container = bordered ? Card : View;

  return (
    <Container className={cn(bordered && 'border', className)} style={style}>
      {header && (
        <View className="p-4 border-b">
          {header}
        </View>
      )}

      <FlatList
        data={dataSource}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <>
            {defaultRenderItem(item, index)}
            {split && index < dataSource.length - 1 && (
              <Separator className="mx-4" />
            )}
          </>
        )}
        numColumns={grid?.column}
        columnWrapperStyle={grid && { gap: grid.gutter }}
        {...flatListProps}
      />

      {footer && (
        <View className="p-4 border-t">
          {footer}
        </View>
      )}

      {renderPagination()}
    </Container>
  );
}

