import { Form } from '../forms';
import type { FieldProps } from 'rc-field-form/es/Field';
import React, { useState } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { Input } from '@/registry/new-york/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type Option,
} from '@/registry/new-york/components/ui/select';
import { Textarea } from '@/registry/new-york/components/ui/textarea';
import { Checkbox } from '@/registry/new-york/components/ui/checkbox';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/registry/new-york/components/ui/radio-group';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

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
  label?: string;
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
    <Form.Item {...(restProps as any)}>
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

export interface ProFormSelectProps<T = any> extends FieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  options?: Array<{ label: string; value: any; disabled?: boolean }>;
  mode?: 'single' | 'multiple';
  showSearch?: boolean;
  label?: string;
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
        const currentOption =
          options.find((opt) => String(opt.value) === String(value)) ||
          (value
            ? { value: String(value), label: String(value) }
            : undefined);

        return (
          <Select
            value={currentOption as any}
            onValueChange={(option: Option) => control.onChange(option?.value)}
            disabled={disabled}
          >
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

export interface ProFormTextAreaProps<T = any> extends FieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  label?: string;
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

export interface ProFormCheckboxProps<T = any> extends FieldProps<T> {
  text?: string;
  disabled?: boolean;
  label?: string;
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

export interface ProFormRadioProps<T = any> extends FieldProps<T> {
  options?: Array<{ label: string; value: any; disabled?: boolean }>;
  disabled?: boolean;
  label?: string;
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

export interface ProFormDigitProps<T = any> extends FieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  label?: string;
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

export interface ProFormSelectMultipleProps<T = any> extends FieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  options?: Array<{ label: string; value: any; disabled?: boolean }>;
  showSearch?: boolean;
  maxTagCount?: number;
}

function ProFormSelectMultiple<T = any>({
  placeholder = 'Please select',
  disabled,
  allowClear,
  options = [],
  maxTagCount,
  ...restProps
}: ProFormSelectMultipleProps<T>) {
  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const value = Array.isArray(control.value) ? control.value : [];

        const handleValueChange = (option: Option) => {
          const currentValues = value as string[];
          if (option?.value && currentValues.includes(option.value)) {
            control.onChange(currentValues.filter(v => v !== option.value));
          } else {
            control.onChange([...currentValues, option?.value]);
          }
        };

        const displayedOptions = maxTagCount 
          ? options.slice(0, maxTagCount)
          : options;

        return (
          <View>
            <Select
              value={
                value[0]
                  ? ({ value: String(value[0]), label: String(value[0]) } as any)
                  : undefined
              }
              onValueChange={handleValueChange}
              disabled={disabled}
            >
              <SelectTrigger className={hasError ? 'border-destructive' : ''}>
                <SelectValue 
                  placeholder={value.length > 0 
                    ? `${value.length} items selected` 
                    : placeholder
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {displayedOptions.map((option) => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                    label={option.label}
                    disabled={option.disabled}
                  />
                ))}
              </SelectContent>
            </Select>
            {value.length > 0 && (
              <View className="mt-2 flex-row flex-wrap gap-1">
                {value.map((val, index) => {
                  const option = options.find(opt => String(opt.value) === String(val));
                  return option ? (
                    <View 
                      key={index}
                      className="bg-primary/10 rounded px-2 py-1 flex-row items-center gap-1"
                    >
                      <Text className="text-xs">{option.label}</Text>
                      {!disabled && (
                        <Text
                          className="text-destructive text-xs"
                          onPress={() =>
                            handleValueChange({ value: String(val), label: String(val) } as any)
                          }
                        >
                          ×
                        </Text>
                      )}
                    </View>
                  ) : null;
                })}
              </View>
            )}
          </View>
        );
      }}
    </Form.Item>
  );
}

export interface ProFormListProps<T = any> {
  name: string;
  creatorButtonText?: string;
  deleteButtonText?: string;
  min?: number;
  max?: number;
  children: (field: { name: number; key: number }, index: number) => React.ReactNode;
}

function ProFormList<T = any>({
  creatorButtonText = 'Add Item',
  deleteButtonText = 'Delete',
  min = 0,
  max,
  children,
  name,
}: ProFormListProps<T>) {
  return (
    <Form.Item name={name as any}>
      {(control, meta) => {
        const value = Array.isArray(control.value) ? control.value : [];
        const hasError = meta.errors && meta.errors.length > 0;

        const addItem = () => {
          if (max === undefined || value.length < max) {
            control.onChange([...value, {} as T]);
          }
        };

        const removeItem = (index: number) => {
          if (min === undefined || value.length > min) {
            const newValue = value.filter((_, i) => i !== index);
            control.onChange(newValue);
          }
        };

        return (
          <View className={hasError ? 'border-destructive border rounded p-2' : ''}>
            {value.map((item, index) => (
              <View key={index} className="mb-2 p-2 border rounded bg-muted/30">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-medium">Item {index + 1}</Text>
                  <Button
                    variant="destructive"
                    size="sm"
                    onPress={() => removeItem(index)}
                    disabled={value.length <= min}
                  >
                    <Text className="text-xs">{deleteButtonText}</Text>
                  </Button>
                </View>
                {children({ name: index, key: index }, index)}
              </View>
            ))}
            <Button
              variant="outline"
              size="sm"
              onPress={addItem}
              disabled={max !== undefined && value.length >= max}
              className="mt-2"
            >
              <Text className="text-sm">{creatorButtonText}</Text>
            </Button>
          </View>
        );
      }}
    </Form.Item>
  );
}

export interface ProFormGroupProps {
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  children: React.ReactNode;
  className?: string;
}

function ProFormGroup({
  title,
  collapsible = false,
  collapsed = false,
  children,
  className = '',
}: ProFormGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  return (
    <View className={`border rounded-lg p-4 mb-4 ${className}`}>
      {title && (
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold">{title}</Text>
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              <Text>{isCollapsed ? '▼' : '▲'}</Text>
            </Button>
          )}
        </View>
      )}
      {!isCollapsed && <View>{children}</View>}
    </View>
  );
}

export interface ProFormDatePickerProps<T = any> extends FieldProps<T> {
  placeholder?: string;
  disabled?: boolean;
  format?: string;
  showTime?: boolean;
}

function ProFormDatePicker<T = any>({
  placeholder = 'Select date',
  disabled,
  format = 'YYYY-MM-DD',
  showTime = false,
  ...restProps
}: ProFormDatePickerProps<T>) {
  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const value = control.value;

        return (
          <Input
            {...control}
            value={value ? String(value) : ''}
            onChangeText={control.onChange}
            onBlur={control.onBlur}
            placeholder={placeholder}
            editable={!disabled}
            className={hasError ? 'border-destructive' : ''}
          />
        );
      }}
    </Form.Item>
  );
}

export interface ProFormDateRangePickerProps<T = any> extends FieldProps<T> {
  placeholder?: [string, string];
  disabled?: boolean;
  format?: string;
}

function ProFormDateRangePicker<T = any>({
  placeholder = ['Start date', 'End date'],
  disabled,
  format = 'YYYY-MM-DD',
  ...restProps
}: ProFormDateRangePickerProps<T>) {
  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const value = control.value || {};
        const [startDate, endDate] = Array.isArray(value) ? value : [value.start, value.end];

        return (
          <View className="flex-row gap-2">
            <Input
              value={startDate ? String(startDate) : ''}
              onChangeText={(text) => {
                const newValue = Array.isArray(value) ? [text, value[1]] : { start: text, end: value?.end };
                control.onChange(newValue);
              }}
              onBlur={control.onBlur}
              placeholder={placeholder[0]}
              editable={!disabled}
              className={`flex-1 ${hasError ? 'border-destructive' : ''}`}
            />
            <Text className="self-center">~</Text>
            <Input
              value={endDate ? String(endDate) : ''}
              onChangeText={(text) => {
                const newValue = Array.isArray(value) ? [value[0], text] : { start: value?.start, end: text };
                control.onChange(newValue);
              }}
              onBlur={control.onBlur}
              placeholder={placeholder[1]}
              editable={!disabled}
              className={`flex-1 ${hasError ? 'border-destructive' : ''}`}
            />
          </View>
        );
      }}
    </Form.Item>
  );
}

export interface ProFormSliderProps<T = any> extends FieldProps<T> {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  marks?: Record<number, string>;
}

function ProFormSlider<T = any>({
  min = 0,
  max = 100,
  step = 1,
  disabled,
  marks,
  ...restProps
}: ProFormSliderProps<T>) {
  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const value = typeof control.value === 'number' ? control.value : min;

        return (
          <View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-muted-foreground">{min}</Text>
              <Text className="text-sm font-medium">{value}</Text>
              <Text className="text-sm text-muted-foreground">{max}</Text>
            </View>
            <View className="h-2 bg-muted rounded-full relative">
              <View 
                className="bg-primary h-2 rounded-full"
                style={{ width: `${((value - min) / (max - min)) * 100}%` }}
              />
              <View 
                className="w-4 h-4 bg-primary rounded-full absolute -top-1"
                style={{ left: `${((value - min) / (max - min)) * 100}%` }}
              />
            </View>
            {marks && (
              <View className="flex-row justify-between mt-2">
                {Object.keys(marks as any).map((markValue) => (
                  <Text key={markValue} className="text-xs text-muted-foreground">
                    {(marks as any)[markValue]}
                  </Text>
                ))}
              </View>
            )}
          </View>
        );
      }}
    </Form.Item>
  );
}

export interface ProFormRateProps<T = any> extends FieldProps<T> {
  count?: number;
  disabled?: boolean;
  allowHalf?: boolean;
  character?: string;
}

function ProFormRate<T = any>({
  count = 5,
  disabled,
  allowHalf = false,
  character = '★',
  ...restProps
}: ProFormRateProps<T>) {
  return (
    <Form.Item {...restProps}>
      {(control, meta) => {
        const hasError = meta.errors && meta.errors.length > 0;
        const value = typeof control.value === 'number' ? control.value : 0;

        const handleRate = (rating: number) => {
          if (!disabled) control.onChange(rating);
        };

        return (
          <View className="flex-row items-center gap-1">
            {Array.from({ length: count * (allowHalf ? 2 : 1) }).map((_, index) => {
              const isHalf = allowHalf && index % 2 === 1;
              const ratingValue = allowHalf ? Math.ceil((index + 1) / 2) : index + 1;
              const isActive = value >= ratingValue;
              return (
                <TouchableOpacity key={index} onPress={() => handleRate(ratingValue)} disabled={disabled}>
                  <Text className={cn(isActive ? 'text-yellow-500' : 'text-muted-foreground', 'text-lg')}>
                    {character}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
    </Form.Item>
  );
}

export {
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormRadio,
  ProFormDigit,
  ProFormSelectMultiple,
  ProFormList,
  ProFormGroup,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSlider,
  ProFormRate,
};