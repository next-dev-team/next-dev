import { Form } from '@rnr/rnr-ui/src/components/ui/forms';
import React, { ReactNode, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export interface QueryFormProps<T = any> {
  form?: any;
  initialValues?: Partial<T>;
  onFinish?: (values: T) => void | Promise<void>;
  onReset?: () => void;
  loading?: boolean;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  defaultCollapsed?: boolean;
  collapseRender?: (collapsed: boolean, props: any) => ReactNode;
  children?: ReactNode;
  className?: string;
  style?: ViewStyle;
}

/**
 * QueryForm - Optimized form for search/filter operations
 * Features collapsible fields and quick reset
 */
export function QueryForm<T = any>({
  form: formInstance,
  initialValues,
  onFinish,
  onReset,
  loading = false,
  collapsed: controlledCollapsed,
  onCollapse,
  defaultCollapsed = false,
  collapseRender,
  children,
  className,
  style,
}: QueryFormProps<T>) {
  const [form] = Form.useForm(formInstance);
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const collapsed = controlledCollapsed ?? internalCollapsed;

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    setInternalCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      await onFinish?.(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  return (
    <View className={cn('w-full bg-card p-4 rounded-lg border border-border', className)} style={style}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <View className="flex-row flex-wrap gap-4">
          {children}
        </View>

        <View className="flex-row gap-2 mt-4 items-center justify-end">
          <Button
            variant="outline"
            onPress={handleReset}
            disabled={loading}
            size="sm"
          >
            <Text>Reset</Text>
          </Button>
          <Button
            onPress={handleSearch}
            disabled={loading}
            size="sm"
          >
            <Text>{loading ? 'Searching...' : 'Search'}</Text>
          </Button>
          {collapseRender && (
            <Button
              variant="ghost"
              onPress={handleCollapse}
              size="sm"
            >
              <Text>{collapsed ? 'Expand' : 'Collapse'}</Text>
            </Button>
          )}
        </View>
      </Form>
    </View>
  );
}

// Attach Form.Item to QueryForm
const QueryFormWithItem = QueryForm as typeof QueryForm & {
  Item: typeof Form.Item;
  useForm: typeof Form.useForm;
};

QueryFormWithItem.Item = Form.Item;
QueryFormWithItem.useForm = Form.useForm;

export default QueryFormWithItem;

