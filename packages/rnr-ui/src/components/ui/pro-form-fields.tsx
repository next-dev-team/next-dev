import { Form } from './forms';
import type { FieldProps } from 'rc-field-form/es/Field';
import React from 'react';
import { View, Platform } from 'react-native';
import { Input } from '../../../../registry/src/new-york/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../registry/src/new-york/components/ui/select';
import { Textarea } from '../../../../registry/src/new-york/components/ui/textarea';
import { Checkbox } from '../../../../registry/src/new-york/components/ui/checkbox';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../../../registry/src/new-york/components/ui/radio-group';
import { Text } from '~/components/ui/text';

// ProFormText - Text input field
export interface ProFormTextProps<T = any> extends FieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  allowClear?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  maxLength?: number;
  showCount?: boolean;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
}

function ProFormText<T = any>({
  placeholder,
  disabled,
  readOnly,
  allowClear,
  prefix,
  suffix,
  maxLength,
  showCount,
  type = 'text',
  ...restProps
}: ProFormTextProps<T>) {
  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const value = control.value ?? '';

        return (
          <Input
            {...control}
            value={String(value)}
            onChangeText={(text) => {
              const finalText = maxLength ? text.slice(0, maxLength) : text;
              control.onChange(finalText);
            }}
            onBlur={control.onBlur}
            placeholder={placeholder}
            editable={!disabled && !readOnly}
            secureTextEntry={type === 'password'}
            keyboardType={
              type === 'email'
                ? 'email-address'
                : type === 'number'
                  ? 'numeric'
                  : type === 'tel'
                    ? 'phone-pad'
                    : type === 'url'
                      ? 'url'
                      : 'default'
            }
            autoCapitalize={type === 'email' || type === 'url' ? 'none' : 'sentences'}
            maxLength={maxLength}
            className={hasError ? 'border-destructive' : ''}
          />
        );
      }}
    </Form.Item>
  );
}

// ProFormSelect - Select dropdown field
export interface ProFormSelectProps<T = any> extends FieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  options?: Array<{ label: string; value: any; disabled?: boolean }>;
  mode?: 'single' | 'multiple';
  showSearch?: boolean;
}

function ProFormSelect<T = any>({
  placeholder = 'Please select',
  disabled,
  allowClear,
  options = [],
  mode = 'single',
  ...restProps
}: ProFormSelectProps<T>) {
  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const value = control.value;

        return (
          <Select value={value} onValueChange={control.onChange} disabled={disabled}>
            <SelectTrigger className={hasError ? 'border-destructive' : ''}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </Form.Item>
  );
}

// ProFormTextArea - Textarea field
export interface ProFormTextAreaProps<T = any> extends FieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
}

function ProFormTextArea<T = any>({
  placeholder,
  disabled,
  readOnly,
  rows = 4,
  maxLength,
  showCount,
  autoSize,
  ...restProps
}: ProFormTextAreaProps<T>) {
  const numberOfLines = typeof autoSize === 'object' ? autoSize.minRows || rows : rows;

  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const value = control.value ?? '';

        return (
          <View>
            <Textarea
              {...control}
              value={String(value)}
              onChangeText={(text) => {
                const finalText = maxLength ? text.slice(0, maxLength) : text;
                control.onChange(finalText);
              }}
              onBlur={control.onBlur}
              placeholder={placeholder}
              editable={!disabled && !readOnly}
              numberOfLines={numberOfLines}
              maxLength={maxLength}
              className={hasError ? 'border-destructive' : ''}
            />
            {showCount && maxLength && (
              <Text className="text-muted-foreground mt-1 text-right text-xs">
                {String(value).length} / {maxLength}
              </Text>
            )}
          </View>
        );
      }}
    </Form.Item>
  );
}

// ProFormCheckbox - Checkbox field
export interface ProFormCheckboxProps<T = any> extends FieldProps<T> {
  text?: string;
  disabled?: boolean;
}

function ProFormCheckbox<T = any>({ text, disabled, ...restProps }: ProFormCheckboxProps<T>) {
  return (
    <Form.Item {...restProps} valuePropName="checked">
      {(control, meta) => {
        const checked = Boolean(control.value);

        return (
          <View className="flex-row items-center gap-2">
            <Checkbox checked={checked} onCheckedChange={control.onChange} disabled={disabled} />
            {text && (
              <Text className="text-sm" onPress={() => !disabled && control.onChange(!checked)}>
                {text}
              </Text>
            )}
          </View>
        );
      }}
    </Form.Item>
  );
}

// ProFormRadio - Radio group field
export interface ProFormRadioProps<T = any> extends FieldProps<T> {
  options?: Array<{ label: string; value: any; disabled?: boolean }>;
  disabled?: boolean;
}

function ProFormRadio<T = any>({ options = [], disabled, ...restProps }: ProFormRadioProps<T>) {
  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const value = control.value;

        return (
          <RadioGroup
            value={String(value ?? '')}
            onValueChange={control.onChange}
            disabled={disabled}
          >
            {options.map((option) => (
              <View key={String(option.value)} className="mb-2 flex-row items-center gap-2">
                <RadioGroupItem
                  value={String(option.value)}
                  disabled={option.disabled || disabled}
                />
                <Text
                  className="text-sm"
                  onPress={() => !disabled && !option.disabled && control.onChange(option.value)}
                >
                  {option.label}
                </Text>
              </View>
            ))}
          </RadioGroup>
        );
      }}
    </Form.Item>
  );
}

// ProFormDigit - Number input field
export interface ProFormDigitProps<T = any> extends FieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}

function ProFormDigit<T = any>({
  placeholder,
  disabled,
  min,
  max,
  step = 1,
  precision,
  ...restProps
}: ProFormDigitProps<T>) {
  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const value = control.value ?? '';

        const handleChange = (text: string) => {
          const num = parseFloat(text);
          if (isNaN(num) && text !== '') {
            return;
          }
          let finalValue: number | string = text === '' ? '' : num;

          if (typeof finalValue === 'number') {
            if (min !== undefined && finalValue < min) {
              finalValue = min;
            }
            if (max !== undefined && finalValue > max) {
              finalValue = max;
            }
            if (precision !== undefined) {
              finalValue = Number(finalValue.toFixed(precision));
            }
          }

          control.onChange(finalValue);
        };

        return (
          <Input
            {...control}
            value={String(value)}
            onChangeText={handleChange}
            onBlur={control.onBlur}
            placeholder={placeholder}
            editable={!disabled}
            keyboardType="numeric"
            className={hasError ? 'border-destructive' : ''}
          />
        );
      }}
    </Form.Item>
  );
}

export { ProFormText, ProFormSelect, ProFormTextArea, ProFormCheckbox, ProFormRadio, ProFormDigit };
