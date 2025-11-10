import FormRc, { Field } from 'rc-field-form';
import { FieldProps } from 'rc-field-form/es/Field';
import React from 'react';
import { View } from 'react-native';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';

function FormItem<T>({
  name,
  label,
  children,
  ...restProps
}: FieldProps<T> & {
  label?: string;
}) {
  const hasRequired = restProps.rules?.some((rule: any) => rule.required);
  return (
    <Field name={name} {...restProps}>
      {(control, meta, form) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const errorMessage = meta.errors?.[0];

        // Handle function children - pass control, meta, form exactly like rc-field-form
        const childNode =
          typeof children === 'function'
            ? children(control, meta, form)
            : React.isValidElement(children)
              ? React.cloneElement(
                  children as React.ReactElement<any>,
                  {
                    ...control,
                    // Map React Native TextInput props
                    value: control.value ?? '',
                    onChangeText: (text: string) => control.onChange(text),
                    onBlur: control.onBlur,
                    // Add error styling if needed
                    className: hasError
                      ? `${(children as any).props?.className || ''} border-destructive`.trim()
                      : (children as any).props?.className,
                  } as any,
                )
              : children;

        // Only add UI wrapper if label or error exists
        if (!label && !errorMessage) {
          return childNode;
        }

        return (
          <View className="mb-4">
            {label && (
              <Label className="mb-2 text-base font-medium">
                {label}
                {hasRequired && <Text className="text-destructive ml-1">*</Text>}
              </Label>
            )}
            {childNode}
            {errorMessage && (
              <Text variant="small" className="text-destructive mt-1">
                {errorMessage}
              </Text>
            )}
          </View>
        );
      }}
    </Field>
  );
}

// Create Form component with Item attached
const Form = FormRc as typeof FormRc & {
  Item: typeof FormItem;
  useForm: typeof FormRc.useForm;
};

Form.Item = FormItem;
Form.useForm = FormRc.useForm;

export { Form };
