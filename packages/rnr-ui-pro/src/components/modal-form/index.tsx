import { Form } from '@rnr/rnr-ui/src/components/ui/forms';
import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rnr/registry/src/new-york/components/ui/dialog';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';

export interface ModalFormProps<T = any> {
  title?: string;
  description?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  form?: any;
  initialValues?: Partial<T>;
  onFinish?: (values: T) => void | Promise<void>;
  onFinishFailed?: (errorInfo: any) => void;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  width?: number | string;
  modalProps?: any;
  submitter?: ReactNode | false;
  className?: string;
  style?: ViewStyle;
}

/**
 * ModalForm - Form displayed in a modal dialog
 * Perfect for create/edit operations
 */
function ModalFormBase<T = any>({
  title = 'Form',
  description,
  trigger,
  open,
  onOpenChange,
  form: formInstance,
  initialValues,
  onFinish,
  onFinishFailed,
  loading = false,
  disabled = false,
  children,
  submitter,
  className,
  style,
}: ModalFormProps<T>) {
  const [form] = Form.useForm(formInstance);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onFinish?.(values);
      onOpenChange?.(false);
    } catch (errorInfo) {
      onFinishFailed?.(errorInfo);
    }
  };

  const renderSubmitter = () => {
    if (submitter === false) return null;
    
    if (submitter) return submitter;

    return (
      <DialogFooter className="flex-row gap-2">
        <DialogClose asChild>
          <Button
            variant="outline"
            disabled={loading}
          >
            <Text>Cancel</Text>
          </Button>
        </DialogClose>
        <Button
          onPress={handleSubmit}
          disabled={disabled || loading}
        >
          <Text>{loading ? 'Submitting...' : 'Submit'}</Text>
        </Button>
      </DialogFooter>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className={className} style={style}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <View className="py-4">
          <Form
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {children}
          </Form>
        </View>

        {renderSubmitter()}
      </DialogContent>
    </Dialog>
  );
}

// Attach Form.Item to ModalForm
const ModalForm = ModalFormBase as typeof ModalFormBase & {
  Item: typeof Form.Item;
  useForm: typeof Form.useForm;
};

ModalForm.Item = Form.Item;
ModalForm.useForm = Form.useForm;

export { ModalForm };

