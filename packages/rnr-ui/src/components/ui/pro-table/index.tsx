import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type Option,
} from '@/registry/new-york/components/ui/select';
import * as TablePrimitive from '@rn-primitives/table';
import { cn } from '@/registry/new-york/lib/utils';
import { Platform } from 'react-native';

export interface ProTableColumn<T = any> {
  title: string;
  dataIndex: keyof T | string[];
  key?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filter?: boolean;
  filters?: Array<{ text: string; value: any }>;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
}

export interface ProTableRequestParams {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}

export interface ProTableRequestData<T = any> {
  data: T[];
  success: boolean;
  total?: number;
  [key: string]: any;
}

export interface ProTableProps<T = any> {
  columns: ProTableColumn<T>[];
  request?: (params: ProTableRequestParams) => Promise<ProTableRequestData<T>>;
  dataSource?: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  pagination?:
    | boolean
    | {
        current?: number;
        pageSize?: number;
        total?: number;
        showSizeChanger?: boolean;
        pageSizeOptions?: string[];
        showQuickJumper?: boolean;
        onChange?: (page: number, pageSize: number) => void;
      };
  search?:
    | boolean
    | {
        labelWidth?: number;
        span?: number;
        searchText?: string;
        resetText?: string;
        optionRender?: (
          searchConfig: any,
          formProps: any,
          dom: React.ReactNode[],
        ) => React.ReactNode[];
      };
  toolBarRender?: () => React.ReactNode[];
  headerTitle?: React.ReactNode;
  actionRef?: React.MutableRefObject<{
    reload: () => void;
    reset: () => void;
  }>;
  onRow?: (
    record: T,
    index: number,
  ) => {
    onPress?: () => void;
  };
  rowSelection?: {
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
}

function ProTable<T extends Record<string, any> = any>({
  columns,
  request,
  dataSource: staticDataSource,
  rowKey = 'id',
  loading: externalLoading,
  pagination: paginationConfig = true,
  search: searchConfig = false,
  toolBarRender,
  headerTitle,
  actionRef,
  onRow,
  rowSelection,
}: ProTableProps<T>) {
  const [dataSource, setDataSource] = useState<T[]>(staticDataSource || []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    rowSelection?.selectedRowKeys || [],
  );

  const loadData = useCallback(async () => {
    if (!request && !staticDataSource) {
      return;
    }

    setLoading(true);
    try {
      if (request) {
        const params: ProTableRequestParams = {
          current: currentPage,
          pageSize,
          ...searchParams,
        };
        const result = await request(params);
        if (result.success) {
          setDataSource(result.data || []);
          setTotal(result.total || result.data?.length || 0);
        }
      } else if (staticDataSource) {
        setDataSource(staticDataSource);
        setTotal(staticDataSource.length);
      }
    } catch (error) {
      console.error('ProTable request error:', error);
    } finally {
      setLoading(false);
    }
  }, [request, staticDataSource, currentPage, pageSize, searchParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReload = useCallback(() => {
    loadData();
  }, [loadData]);

  const handleReset = useCallback(() => {
    setSearchParams({});
    setCurrentPage(1);
    loadData();
  }, [loadData]);

  if (actionRef) {
    actionRef.current = {
      reload: handleReload,
      reset: handleReset,
    };
  }

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || String(index);
  };

  const renderCell = (column: ProTableColumn<T>, record: T, index: number) => {
    const dataIndex = Array.isArray(column.dataIndex) ? column.dataIndex : [column.dataIndex];

    let value = record;
    for (const key of dataIndex) {
      value = value?.[key];
    }

    if (column.render) {
      return column.render(value, record, index);
    }

    return <Text className="text-sm">{String(value ?? '')}</Text>;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearch = (values: Record<string, any>) => {
    setSearchParams(values);
    setCurrentPage(1);
  };

  const handleRowSelectionChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
    if (rowSelection?.onChange) {
      const selectedRows = dataSource.filter((record, index) =>
        keys.includes(getRowKey(record, index)),
      );
      rowSelection.onChange(keys, selectedRows);
    }
  };

  const isLoading = loading || externalLoading;

  return (
    <View className="w-full flex-1">
      {(headerTitle || toolBarRender) && (
        <View className="mb-4 flex-row items-center justify-between">
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

      {searchConfig && (
        <View className="bg-muted mb-4 rounded-md p-4">
          <View className="flex-row flex-wrap gap-4">
            {columns
              .filter((col) => col.filter)
              .map((column) => {
                const dataIndex = Array.isArray(column.dataIndex)
                  ? column.dataIndex[0]
                  : column.dataIndex;
                const searchKey = Array.isArray(dataIndex) ? dataIndex.join('.') : String(dataIndex);
                return (
                  <View key={String(column.key || dataIndex)} className="min-w-[200px] flex-1">
                    <Text className="mb-1 text-sm">{column.title}</Text>
                    {column.filters ? (
                      <Select
                        value={{
                          value: String(searchParams[searchKey] || ''),
                          label: String(searchParams[searchKey] || ''),
                        }}
                        onValueChange={(option: Option) =>
                          handleSearch({ ...searchParams, [searchKey]: option?.value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${column.title}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {column.filters.map((filter) => (
                            <SelectItem key={String(filter.value)} value={String(filter.value)} label={filter.text}>
                              {filter.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder={`Search ${column.title}`}
                        value={String(searchParams[searchKey] || '')}
                        onChangeText={(text: string) =>
                          handleSearch({ ...searchParams, [searchKey]: text })
                        }
                      />
                    )}
                  </View>
                );
              })}
            <View className="flex-row items-end gap-2">
              <Button onPress={() => handleSearch(searchParams)}>
                <Text>Search</Text>
              </Button>
              <Button variant="outline" onPress={handleReset}>
                <Text>Reset</Text>
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className="overflow-hidden rounded-md border flex-1">
        {isLoading && (
          <View className="bg-background/50 absolute inset-0 z-10 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        )}

        <View className="bg-muted flex-row border-b">
          {rowSelection && (
            <View className="w-12 items-center justify-center p-2">
              <Text className="text-xs font-medium">Select</Text>
            </View>
          )}
          {columns.map((column) => (
            <View
              key={String(column.key || column.dataIndex)}
              className={cn(
                'border-r p-2 last:border-r-0',
                column.width ? `w-[${column.width}]` : 'flex-1',
                column.align === 'center' && 'items-center',
                column.align === 'right' && 'items-end',
              )}
            >
              <Text className="text-xs font-medium">{column.title}</Text>
            </View>
          ))}
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          {dataSource.length === 0 ? (
            <View className="items-center justify-center p-8 flex-1">
              <Text className="text-muted-foreground">No data</Text>
            </View>
          ) : (
            dataSource.map((record, index) => {
              const key = getRowKey(record, index);
              const rowProps = onRow ? onRow(record, index) : {};

              return (
                <View
                  key={key}
                  className={cn(
                    'flex-row border-b last:border-b-0',
                    rowProps.onPress && 'active:bg-muted',
                  )}
                  {...(rowProps.onPress && {
                    onPress: rowProps.onPress,
                  })}
                >
                  {rowSelection && (
                    <View className="w-12 items-center justify-center p-2">
                      <Pressable
                        className={cn(
                          'h-4 w-4 rounded border',
                          selectedRowKeys.includes(key) && 'bg-primary border-primary',
                        )}
                        onPress={() => {
                          const newKeys = selectedRowKeys.includes(key)
                            ? selectedRowKeys.filter((k) => k !== key)
                            : [...selectedRowKeys, key];
                          handleRowSelectionChange(newKeys);
                        }}
                      />
                    </View>
                  )}
                  {columns.map((column) => (
                    <View
                      key={String(column.key || column.dataIndex)}
                      className={cn(
                        'border-r p-2 last:border-r-0',
                        column.width ? `w-[${column.width}]` : 'flex-1',
                        column.align === 'center' && 'items-center',
                        column.align === 'right' && 'items-end',
                        column.ellipsis && 'overflow-hidden',
                      )}
                    >
                      {renderCell(column, record, index)}
                    </View>
                  ))}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      {paginationConfig && (
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-muted-foreground text-sm">
            Showing {dataSource.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, total)} of {total} entries
          </Text>
          <View className="flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Text>Previous</Text>
            </Button>
            <Text className="px-2 py-1 text-sm">
              Page {currentPage} of {Math.ceil(total / pageSize) || 1}
            </Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(total / pageSize)}
            >
              <Text>Next</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

export { ProTable };