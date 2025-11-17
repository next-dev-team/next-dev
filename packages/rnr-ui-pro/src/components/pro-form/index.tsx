import { Form } from '@rnr/rnr-ui/src/components/ui/forms';
import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export type ProFormLayout = 'horizontal' | 'vertical' | 'inline';

export interface ProFormProps<T = any> {
  form?: any;
  initialValues?: Partial<T>;
  onFinish?: (values: T) => void | Promise<void>;
  onFinishFailed?: (errorInfo: any) => void;
  layout?: ProFormLayout;
  submitter?: ReactNode | false;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  style?: ViewStyle;
  title?: string;
  description?: string;
}

/**
 * ProForm - Advanced form component with built-in layout and submission handling
 * Inspired by Ant Design Pro's ProForm
 */
function ProFormBase<T = any>({
  form: formInstance,
  initialValues,
  onFinish,
  onFinishFailed,
  layout = 'vertical',
  submitter,
  loading = false,
  disabled = false,
  children,
  className,
  style,
  title,
  description,
}: ProFormProps<T>) {
  const [form] = Form.useForm(formInstance);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onFinish?.(values);
    } catch (errorInfo) {
      onFinishFailed?.(errorInfo);
    }
  };

  const renderSubmitter = () => {
    if (submitter === false) return null;
    
    if (submitter) return submitter;

    return (
      <View className={cn(
        'flex-row gap-2 mt-6',
        layout === 'horizontal' && 'justify-end'
      )}>
        <Button
          variant="outline"
          onPress={() => form.resetFields()}
          disabled={disabled || loading}
          className="flex-1 md:flex-initial"
        >
          <Text>Reset</Text>
        </Button>
        <Button
          onPress={handleSubmit}
          disabled={disabled || loading}
          className="flex-1 md:flex-initial"
        >
          <Text>{loading ? 'Submitting...' : 'Submit'}</Text>
        </Button>
      </View>
    );
  };

  return (
    <View className={cn('w-full', className)} style={style}>
      {(title || description) && (
        <View className="mb-6">
          {title && (
            <Text className="text-2xl font-bold mb-2">{title}</Text>
          )}
          {description && (
            <Text className="text-muted-foreground">{description}</Text>
          )}
        </View>
      )}
      
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <View className={cn(
          layout === 'horizontal' && 'flex-row flex-wrap',
          layout === 'inline' && 'flex-row flex-wrap gap-2'
        )}>
          {children}
        </View>
        {renderSubmitter()}
      </Form>
    </View>
  );
}

// Attach Form.Item to ProForm
const ProForm = ProFormBase as typeof ProFormBase & {
  Item: typeof Form.Item;
  useForm: typeof Form.useForm;
};

ProForm.Item = Form.Item;
ProForm.useForm = Form.useForm;

export { ProForm };

