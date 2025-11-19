import React from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export interface ProListMeta {
  /**
   * Title
   */
  title?: React.ReactNode;
  /**
   * Description
   */
  description?: React.ReactNode;
  /**
   * Avatar
   */
  avatar?: React.ReactNode | { src?: string; icon?: React.ReactNode };
  /**
   * Actions
   */
  actions?: React.ReactNode[];
}

export interface ProListItem<T = any> {
  /**
   * Item data
   */
  data: T;
  /**
   * Item meta
   */
  meta?: ProListMeta;
  /**
   * Item content
   */
  content?: React.ReactNode;
  /**
   * Item actions
   */
  actions?: React.ReactNode[];
  /**
   * Item extra
   */
  extra?: React.ReactNode;
  /**
   * Custom render function
   */
  render?: (item: T, index: number) => React.ReactNode;
}

export interface ProListProps<T = any> {
  /**
   * Data source
   */
  dataSource?: T[];
  /**
   * Request function
   */
  request?: (params: any) => Promise<{ data: T[]; success: boolean; total?: number }>;
  /**
   * Item render function
   */
  renderItem?: (item: T, index: number) => React.ReactNode;
  /**
   * Meta render function
   */
  itemLayout?: 'vertical' | 'horizontal';
  /**
   * List size: 'default' | 'large' | 'small'
   * @default 'default'
   */
  size?: 'default' | 'large' | 'small';
  /**
   * Split
   * @default true
   */
  split?: boolean;
  /**
   * Grid columns (for grid layout)
   */
  grid?: { gutter?: number; column?: number };
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Pagination config
   */
  pagination?:
    | boolean
    | {
        current?: number;
        pageSize?: number;
        total?: number;
        onChange?: (page: number, pageSize: number) => void;
      };
  /**
   * Header title
   */
  headerTitle?: React.ReactNode;
  /**
   * Toolbar render
   */
  toolBarRender?: () => React.ReactNode[];
  /**
   * Row key
   */
  rowKey?: string | ((item: T, index: number) => string);
  /**
   * On item press
   */
  onItemPress?: (item: T, index: number) => void;
}

function ProList<T extends Record<string, any> = any>({
  dataSource = [],
  request,
  renderItem,
  itemLayout = 'vertical',
  size = 'default',
  split = true,
  grid,
  loading = false,
  pagination = false,
  headerTitle,
  toolBarRender,
  rowKey = 'id',
  onItemPress,
}: ProListProps<T>) {
  const [data, setData] = React.useState<T[]>(dataSource);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(loading);

  React.useEffect(() => {
    if (request) {
      setIsLoading(true);
      request({ current: currentPage, pageSize })
        .then((result) => {
          if (result.success) {
            setData(result.data || []);
            setTotal(result.total || result.data?.length || 0);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setData(dataSource);
      setTotal(dataSource.length);
    }
  }, [request, currentPage, pageSize, dataSource]);

  const getRowKey = (item: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(item, index);
    }
    return item[rowKey] || String(index);
  };

  const renderMeta = (meta?: ProListMeta) => {
    if (!meta) return null;

    const avatarContent = meta.avatar ? (
      typeof meta.avatar === 'object' && 'src' in meta.avatar ? (
        meta.avatar.src ? (
          <Image source={{ uri: meta.avatar.src }} className="h-12 w-12 rounded-full" />
        ) : (
          meta.avatar.icon
        )
      ) : (
        meta.avatar
      )
    ) : null;

    return (
      <View className="flex-row items-start gap-3">
        {avatarContent && <View>{avatarContent}</View>}
        <View className="flex-1">
          {meta.title && (
            <Text variant="h4" className="mb-1">
              {meta.title}
            </Text>
          )}
          {meta.description && (
            <Text variant="muted" className="text-sm">
              {meta.description}
            </Text>
          )}
        </View>
        {meta.actions && meta.actions.length > 0 && (
          <View className="flex-row gap-2">
            {meta.actions.map((action, index) => (
              <View key={index}>{action}</View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderListItem = (item: T, index: number) => {
    if (renderItem) {
      return renderItem(item, index);
    }

    const key = getRowKey(item, index);
    const meta = (item as any).meta;
    const content = (item as any).content;
    const actions = (item as any).actions;
    const extra = (item as any).extra;

    if (itemLayout === 'horizontal') {
      return (
        <Pressable
          key={key}
          onPress={() => onItemPress?.(item, index)}
          className={cn(
            'flex-row items-center justify-between p-4',
            split && 'border-b',
            onItemPress && 'active:bg-accent',
          )}
        >
          {renderMeta(meta)}
          {content && <View className="ml-4 flex-1">{content}</View>}
          {extra && <View className="ml-4">{extra}</View>}
          {actions && actions.length > 0 && (
            <View className="ml-4 flex-row gap-2">
              {actions.map((action, idx) => (
                <View key={idx}>{action}</View>
              ))}
            </View>
          )}
        </Pressable>
      );
    }

    return (
      <Pressable
        key={key}
        onPress={() => onItemPress?.(item, index)}
        className={cn('p-4', split && 'border-b', onItemPress && 'active:bg-accent')}
      >
        {renderMeta(meta)}
        {content && <View className="mt-2">{content}</View>}
        {(actions || extra) && (
          <View className="mt-3 flex-row items-center justify-between">
            {extra && <View>{extra}</View>}
            {actions && actions.length > 0 && (
              <View className="flex-row gap-2">
                {actions.map((action, idx) => (
                  <View key={idx}>{action}</View>
                ))}
              </View>
            )}
          </View>
        )}
      </Pressable>
    );
  };

  const paddingMap = {
    default: 'p-4',
    large: 'p-6',
    small: 'p-2',
  };

  if (isLoading) {
    return (
      <View className="gap-4">
        {headerTitle && <Text variant="h3">{headerTitle}</Text>}
        <View className="gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} className="bg-muted h-20 animate-pulse rounded" />
          ))}
        </View>
      </View>
    );
  }

  if (grid) {
    const columns = grid.column || 2;
    const gutter = grid.gutter || 16;

    return (
      <View className="gap-4">
        {(headerTitle || toolBarRender) && (
          <View className="flex-row items-center justify-between">
            {headerTitle && <Text variant="h3">{headerTitle}</Text>}
            {toolBarRender && (
              <View className="flex-row gap-2">
                {toolBarRender().map((item, index) => (
                  <React.Fragment key={index}>{item}</React.Fragment>
                ))}
              </View>
            )}
          </View>
        )}
        <View className="flex-row flex-wrap" style={{ marginHorizontal: -gutter / 2 }}>
          {data.map((item, index) => (
            <View
              key={getRowKey(item, index)}
              style={{
                width: `${100 / columns}%`,
                paddingHorizontal: gutter / 2,
                marginBottom: gutter,
              }}
            >
              {renderListItem(item, index)}
            </View>
          ))}
        </View>
        {pagination && (
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-muted-foreground text-sm">
              Showing {data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(currentPage * pageSize, total)} of {total} entries
            </Text>
            <View className="flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onPress={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Text className="px-2 py-1 text-sm">
                Page {currentPage} of {Math.ceil(total / pageSize) || 1}
              </Text>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(total / pageSize)}
              >
                Next
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="gap-4">
      {(headerTitle || toolBarRender) && (
        <View className="flex-row items-center justify-between">
          {headerTitle && <Text variant="h3">{headerTitle}</Text>}
          {toolBarRender && (
            <View className="flex-row gap-2">
              {toolBarRender().map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))}
            </View>
          )}
        </View>
      )}
      <ScrollView>
        <View className={cn('bg-card rounded-lg', split && 'border')}>
          {data.length === 0 ? (
            <View className="items-center justify-center p-8">
              <Text className="text-muted-foreground">No data</Text>
            </View>
          ) : (
            data.map((item, index) => renderListItem(item, index))
          )}
        </View>
      </ScrollView>
      {pagination && (
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-muted-foreground text-sm">
            Showing {data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, total)} of {total} entries
          </Text>
          <View className="flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onPress={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text className="px-2 py-1 text-sm">
              Page {currentPage} of {Math.ceil(total / pageSize) || 1}
            </Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(total / pageSize)}
            >
              Next
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

export { ProList };
export type { ProListProps, ProListMeta, ProListItem };
