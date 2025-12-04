import { Form } from './forms';
import type { FormProps as RcFormProps } from 'rc-field-form';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export interface ProFormProps<T = any> extends Omit<RcFormProps<T>, 'onFinish'> {
  /**
   * Form layout
   * @default 'horizontal'
   */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /**
   * Submit button text
   * @default 'Submit'
   */
  submitButtonText?: string;
  /**
   * Reset button text
   */
  resetButtonText?: string;
  /**
   * Show submit button
   * @default true
   */
  submitter?:
    | boolean
    | {
        submitButtonProps?: React.ComponentProps<typeof Button>;
        resetButtonProps?: React.ComponentProps<typeof Button>;
        render?: (
          props: {
            submit: () => void;
            reset: () => void;
            loading?: boolean;
          },
          dom: React.ReactNode,
        ) => React.ReactNode;
      };
  /**
   * Form submit handler
   */
  onFinish?: (values: T) => void | Promise<void>;
  /**
   * Form reset handler
   */
  onReset?: () => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Form title
   */
  title?: string;
  /**
   * Form description
   */
  description?: string;
  /**
   * Enable scroll
   * @default false
   */
  scrollToFirstError?: boolean;
  /**
   * Grid columns for horizontal layout
   * @default 3
   */
  gridCols?: number;
}

function ProForm<T = any>({
  layout = 'horizontal',
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  submitter = true,
  onFinish,
  onReset,
  loading = false,
  title,
  description,
  scrollToFirstError = false,
  gridCols = 3,
  children,
  ...restProps
}: ProFormProps<T>) {
  const [form] = Form.useForm(restProps.form);

  const handleFinish = async (values: T) => {
    if (onFinish) {
      await onFinish(values);
    }
  };

  const handleReset = () => {
    form.resetFields();
    if (onReset) {
      onReset();
    }
  };

  const renderSubmitter = () => {
    if (submitter === false) {
      return null;
    }

    if (typeof submitter === 'object' && submitter.render) {
      return submitter.render(
        {
          submit: () => form.submit(),
          reset: handleReset,
          loading,
        },
        <View className="mt-4 flex-row gap-2">
          <Button onPress={() => form.submit()} disabled={loading} {...submitter.submitButtonProps}>
            <Text>{submitButtonText}</Text>
          </Button>
          {resetButtonText && (
            <Button
              variant="outline"
              onPress={handleReset}
              disabled={loading}
              {...submitter.resetButtonProps}
            >
              <Text>{resetButtonText}</Text>
            </Button>
          )}
        </View>,
      );
    }

    return (
      <View className="mt-4 flex-row gap-2">
        <Button onPress={() => form.submit()} disabled={loading}>
          <Text>{submitButtonText}</Text>
        </Button>
        {resetButtonText && (
          <Button variant="outline" onPress={handleReset} disabled={loading}>
            <Text>{resetButtonText}</Text>
          </Button>
        )}
      </View>
    );
  };

  const formContent = (
    <Form {...restProps} form={form} onFinish={handleFinish}>
      {title && (
        <Text variant="h3" className="mb-2">
          {title}
        </Text>
      )}
      {description && (
        <Text variant="muted" className="mb-4">
          {description}
        </Text>
      )}
      <View className={layout === 'horizontal' ? 'flex-row flex-wrap gap-4' : ''}>{children}</View>
      {renderSubmitter()}
    </Form>
  );

  if (scrollToFirstError) {
    return <ScrollView>{formContent}</ScrollView>;
  }

  return formContent;
}

// Attach useForm to ProForm
ProForm.useForm = Form.useForm;

export { ProForm };
