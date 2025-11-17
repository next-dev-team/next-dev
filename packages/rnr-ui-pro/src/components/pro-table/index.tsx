import React, { ReactNode, useState, useMemo } from 'react';
import { View, ViewStyle, ScrollView, Pressable } from 'react-native';
import { Card } from '@rnr/registry/src/new-york/components/ui/card';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';
import { Separator } from '@rnr/registry/src/new-york/components/ui/separator';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export interface ProTableColumn<T = any> {
  title: ReactNode;
  dataIndex?: keyof T;
  key?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  sorter?: boolean | ((a: T, b: T) => number);
  render?: (value: any, record: T, index: number) => ReactNode;
  hideInTable?: boolean;
  hideInSearch?: boolean;
  search?: boolean;
  valueType?: 'text' | 'select' | 'date' | 'dateRange';
  valueEnum?: Record<string, { text: string; status?: string }>;
}

export interface ProTableProps<T = any> {
  columns: ProTableColumn<T>[];
  dataSource?: T[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string);
  search?:
    | {
        defaultCollapsed?: boolean;
        collapsed?: boolean;
        onCollapse?: (collapsed: boolean) => void;
        searchText?: string;
        resetText?: string;
      }
    | false;
  pagination?:
    | {
        current?: number;
        pageSize?: number;
        total?: number;
        onChange?: (page: number, pageSize?: number) => void;
        showSizeChanger?: boolean;
        pageSizeOptions?: number[];
      }
    | false;
  toolbar?: {
    title?: ReactNode;
    subTitle?: ReactNode;
    actions?: ReactNode[];
  };
  options?:
    | {
        reload?: () => void;
        density?: boolean;
        fullScreen?: boolean;
        setting?: boolean;
      }
    | false;
  onRow?: (
    record: T,
    index: number,
  ) => {
    onPress?: () => void;
  };
  headerTitle?: ReactNode;
  bordered?: boolean;
  className?: string;
  style?: ViewStyle;
}

/**
 * ProTable - Advanced table component with search, pagination, and toolbar
 * Inspired by Ant Design Pro's ProTable
 */
export function ProTable<T extends Record<string, any>>({
  columns,
  dataSource = [],
  loading = false,
  rowKey = 'id' as keyof T,
  search = {},
  pagination = {},
  toolbar,
  options = {},
  onRow,
  headerTitle,
  bordered = true,
  className,
  style,
}: ProTableProps<T>) {
  const [searchValues, setSearchValues] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(
    pagination !== false ? pagination.current || 1 : 1,
  );
  const [pageSize, setPageSize] = useState(pagination !== false ? pagination.pageSize || 10 : 10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter columns for display
  const displayColumns = columns.filter((col) => !col.hideInTable);

  // Handle search
  const handleSearch = (key: string, value: any) => {
    setSearchValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchValues({});
    setCurrentPage(1);
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...dataSource];

    // Apply search filters
    const entries = Object.keys(searchValues).map((key) => [key, searchValues[key]]);
    entries.forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item) => {
          const itemValue = String(item[key]).toLowerCase();
          const searchValue = String(value).toLowerCase();
          return itemValue.indexOf(searchValue) !== -1;
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let foundColumn: ProTableColumn<T> | undefined;
        for (let i = 0; i < columns.length; i++) {
          if (String(columns[i].dataIndex) === sortConfig.key) {
            foundColumn = columns[i];
            break;
          }
        }

        if (foundColumn?.sorter && typeof foundColumn.sorter === 'function') {
          return sortConfig.direction === 'asc'
            ? foundColumn.sorter(a, b)
            : foundColumn.sorter(b, a);
        }

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [dataSource, searchValues, sortConfig, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return processedData.slice(start, end);
  }, [processedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  const handleSort = (column: ProTableColumn<T>) => {
    if (!column.sorter) return;

    const key = String(column.dataIndex);
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] ?? index);
  };

  // Render search form
  const renderSearch = () => {
    if (search === false) return null;

    const searchableColumns = columns.filter((col) => col.search && !col.hideInSearch);
    if (searchableColumns.length === 0) return null;

    return (
      <View className="bg-muted/30 border-b p-4">
        <View className="mb-3 flex-row flex-wrap gap-3">
          {searchableColumns.map((col) => (
            <View key={String(col.dataIndex)} className="min-w-[200px] flex-1">
              <Text className="mb-1 text-sm">{col.title}</Text>
              <Input
                placeholder={`Search ${col.title}`}
                value={searchValues[String(col.dataIndex)] || ''}
                onChangeText={(value) => handleSearch(String(col.dataIndex), value)}
              />
            </View>
          ))}
        </View>
        <View className="flex-row gap-2">
          <Button size="sm" onPress={() => {}}>
            <Text>{search.searchText || 'Search'}</Text>
          </Button>
          <Button size="sm" variant="outline" onPress={handleResetSearch}>
            <Text>{search.resetText || 'Reset'}</Text>
          </Button>
        </View>
      </View>
    );
  };

  // Render toolbar
  const renderToolbar = () => {
    if (!toolbar && !headerTitle) return null;

    return (
      <View className="flex-row items-center justify-between border-b p-4">
        <View>
          {(toolbar?.title || headerTitle) && (
            <Text className="text-lg font-semibold">{toolbar?.title || headerTitle}</Text>
          )}
          {toolbar?.subTitle && (
            <Text className="text-muted-foreground text-sm">{toolbar.subTitle}</Text>
          )}
        </View>
        {toolbar?.actions && toolbar.actions.length > 0 && (
          <View className="flex-row gap-2">
            {toolbar.actions.map((action, index) => (
              <View key={index}>{action}</View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Render table header
  const renderHeader = () => (
    <View className="bg-muted/50 flex-row border-b">
      {displayColumns.map((col, index) => (
        <Pressable
          key={col.key || String(col.dataIndex) || index}
          className={cn(
            'border-r p-3 last:border-r-0',
            col.sorter && 'flex-row items-center gap-1',
          )}
          style={{ width: col.width || 'auto', flex: col.width ? undefined : 1 }}
          onPress={() => handleSort(col)}
          disabled={!col.sorter}
        >
          <Text className="text-sm font-semibold">{col.title}</Text>
          {col.sorter && sortConfig?.key === String(col.dataIndex) && (
            <Text className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );

  // Render table row
  const renderRow = (record: T, index: number) => {
    const rowProps = onRow?.(record, index);

    return (
      <Pressable
        key={getRowKey(record, index)}
        className="hover:bg-muted/50 flex-row border-b"
        onPress={rowProps?.onPress}
      >
        {displayColumns.map((col, colIndex) => {
          const value = col.dataIndex ? record[col.dataIndex] : undefined;
          const content = col.render
            ? col.render(value, record, index)
            : value !== null && value !== undefined
              ? String(value)
              : '-';

          return (
            <View
              key={col.key || String(col.dataIndex) || colIndex}
              className={cn(
                'border-r p-3 last:border-r-0',
                col.align === 'center' && 'items-center',
                col.align === 'right' && 'items-end',
              )}
              style={{ width: col.width || 'auto', flex: col.width ? undefined : 1 }}
            >
              <Text className="text-sm">{content}</Text>
            </View>
          );
        })}
      </Pressable>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination) return null;

    return (
      <View className="flex-row items-center justify-between border-t p-4">
        <Text className="text-muted-foreground text-sm">Total {processedData.length} items</Text>

        <View className="flex-row items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              const newPage = currentPage - 1;
              setCurrentPage(newPage);
              if (pagination && typeof pagination === 'object') {
                pagination.onChange?.(newPage, pageSize);
              }
            }}
            disabled={currentPage === 1}
          >
            <Text>Previous</Text>
          </Button>

          <Text className="px-2 text-sm">
            Page {currentPage} of {totalPages}
          </Text>

          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              const newPage = currentPage + 1;
              setCurrentPage(newPage);
              if (pagination && typeof pagination === 'object') {
                pagination.onChange?.(newPage, pageSize);
              }
            }}
            disabled={currentPage === totalPages}
          >
            <Text>Next</Text>
          </Button>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <Card className={cn(bordered && 'border', className)} style={style}>
        <View className="items-center py-12">
          <Text className="text-muted-foreground">Loading...</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card className={cn(bordered && 'border', className)} style={style}>
      {renderToolbar()}
      {renderSearch()}

      <ScrollView horizontal>
        <View className="min-w-full">
          {renderHeader()}
          {paginatedData.length > 0 ? (
            paginatedData.map((record, index) => renderRow(record, index))
          ) : (
            <View className="items-center py-12">
              <Text className="text-muted-foreground">No data</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {renderPagination()}
    </Card>
  );
}
