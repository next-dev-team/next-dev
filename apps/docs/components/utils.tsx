'use client';
import { hello, helloAsync, omit, pick } from '@rnr/utils';
import type { ComponentProps, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Button as DocsButton } from './ui/button';
import { Form } from '@/rnr-ui/components/ui/forms';

type BaseUtilityPlaygroundRenderProps = {
  close: () => void;
};

type BaseUtilityPlaygroundProps = {
  title: string;
  description?: string;
  triggerText: string;
  triggerIcon?: ReactNode;
  triggerVariant?: ComponentProps<typeof DocsButton>['variant'];
  onOpen?: () => void;
  children: ReactNode | ((helpers: BaseUtilityPlaygroundRenderProps) => ReactNode);
};

export function BaseUtilityPlayground({
  title,
  description,
  triggerText,
  triggerIcon,
  triggerVariant = 'outline',
  onOpen,
  children,
}: BaseUtilityPlaygroundProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const content = useMemo(() => {
    return typeof children === 'function' ? children({ close: closeModal }) : children;
  }, [children, closeModal]);

  return (
    <>
      <DocsButton
        type="button"
        variant={triggerVariant}
        className="flex-row items-center gap-2 self-start"
        onClick={openModal}
      >
        {triggerIcon}
        <Text className="text-sm font-semibold text-foreground">{triggerText}</Text>
      </DocsButton>

      <Modal animationType="fade" transparent visible={isOpen} onRequestClose={closeModal}>
        <Pressable className="flex-1 bg-black/50" onPress={closeModal}>
          <Pressable
            className="h-full w-full items-center justify-center px-4"
            onPress={(event) => event.stopPropagation()}>
            <View className="max-h-[90%] w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-background dark:border-gray-800 dark:bg-gray-950">
              <View className="flex-row items-center justify-between border-b border-border bg-muted/40 px-4 py-3 dark:border-gray-800">
                <View className="flex-row items-center gap-2">
                  {triggerIcon}
                  <Text className="text-base font-semibold text-foreground">{title}</Text>
                </View>
                <DocsButton type="button" variant="ghost" onClick={closeModal}>
                  Close
                </DocsButton>
              </View>

              <ScrollView className="px-4 py-5" contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="gap-5">
                  {description ? (
                    <Text className="text-sm text-muted-foreground">{description}</Text>
                  ) : null}
                  {content}
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const defaultHelloName = 'React Native';

export function HelloDemo() {
  const [name, setName] = useState<string>(defaultHelloName);
  const [syncResult, setSyncResult] = useState<string>(() => hello(defaultHelloName));
  const [asyncResult, setAsyncResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const updateSyncResult = useCallback((value: string) => {
    setSyncResult(hello(value));
  }, []);

  const updateAsyncResult = useCallback(async (value: string) => {
    setLoading(true);
    try {
      const response = await helloAsync(value);
      setAsyncResult(response);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateSyncResult(defaultHelloName);
    void updateAsyncResult(defaultHelloName);
  }, [updateAsyncResult, updateSyncResult]);

  const handleRun = useCallback(() => {
    const target = name.trim() || 'World';
    updateSyncResult(target);
    void updateAsyncResult(target);
  }, [name, updateAsyncResult, updateSyncResult]);

  const handleReset = useCallback(() => {
    setName(defaultHelloName);
    updateSyncResult(defaultHelloName);
    void updateAsyncResult(defaultHelloName);
  }, [updateAsyncResult, updateSyncResult]);

  return (
    <BaseUtilityPlayground
      triggerText="Open Hello Playground"
      triggerIcon={<Text className="text-lg">🧪</Text>}
      title="Hello Playground"
      description="Try the synchronous and asynchronous greeting helpers with your own input."
      onOpen={handleReset}
    >
      {() => (
        <>
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
              autoCorrect={false}
              className="border-input bg-background text-foreground rounded-md border px-3 py-2"
              placeholder="Friend"
            />
          </View>

          <View className="flex-row gap-3">
            <DocsButton type="button" onClick={handleRun}>
              Run playground
            </DocsButton>
            <DocsButton type="button" variant="outline" onClick={handleReset}>
              Reset
            </DocsButton>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Results</Text>
            <View className="gap-2 rounded-md border border-border bg-background/80 p-3 dark:border-gray-800 dark:bg-gray-950/80">
              <View className="gap-1">
                <Text className="text-xs font-medium uppercase text-muted-foreground">Synchronous</Text>
                <Text className="font-mono text-sm text-foreground">{syncResult}</Text>
              </View>
              <View className="gap-1">
                <Text className="text-xs font-medium uppercase text-muted-foreground">Asynchronous</Text>
                <Text className="font-mono text-sm text-foreground">
                  {loading ? 'Loading...' : asyncResult}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </BaseUtilityPlayground>
  );
}

export function ConfigUsageDemo() {
  const demos = [
    {
      key: 'prettier',
      title: 'Prettier',
      description: 'Share formatting defaults across workspaces.',
      code: `// prettier.config.cjs\nmodule.exports = require('@rnr/config/prettier');`,
    },
    {
      key: 'eslint',
      title: 'ESLint',
      description: 'Extend the Next.js + TypeScript linting baseline.',
      code: `// eslint.config.cjs\nmodule.exports = require('@rnr/config/eslint/next');`,
    },
    {
      key: 'vitest',
      title: 'Vitest',
      description: 'Start from a coverage-enabled testing config.',
      code: `// vitest.config.ts\nimport baseConfig from '@rnr/config/vitest/base';\nimport { defineConfig, mergeConfig } from 'vitest/config';\n\nexport default mergeConfig(\n  baseConfig,\n  defineConfig({\n    test: {\n      coverage: {\n        lines: 100,\n      },\n    },\n  }),\n);`,
    },
  ] as const;

  const [index, setIndex] = useState<number>(0);
  const current = demos[index];

  const handleNext = () => setIndex((previous) => (previous + 1) % demos.length);
  const handlePrev = () => setIndex((previous) => (previous - 1 + demos.length) % demos.length);

  return (
    <View className="gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
      <View className="gap-1">
        <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Shared Config Demo
        </Text>
        <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100">{current.title}</Text>
        <Text className="text-sm text-gray-700 dark:text-gray-300">{current.description}</Text>
      </View>

      <View className="rounded border bg-white p-3 dark:bg-gray-800">
        <Text className="font-mono text-xs text-gray-500 dark:text-gray-400">{current.code}</Text>
      </View>

      <View className="flex-row justify-between gap-2">
        <Button title="Previous" onPress={handlePrev} />
        <Text className="self-center font-mono text-xs uppercase text-gray-500 dark:text-gray-400">
          {index + 1} / {demos.length}
        </Text>
        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  );
}

type ObjectPlaygroundFormValues = {
  source: string;
  keys: string[];
};

type ObjectPlaygroundOperation = 'pick' | 'omit';

const defaultSource = {
  id: 1,
  name: 'Ada Lovelace',
  role: 'admin',
  email: 'ada@example.com',
  password: 'super-secret',
} as const;

const defaultKeys = ['password'] as const;
const defaultOperation: ObjectPlaygroundOperation = 'omit';
const defaultSourceJson = JSON.stringify(defaultSource, null, 2);
const defaultResultJson = JSON.stringify(omit(defaultSource, defaultKeys), null, 2);

export function ObjectUtilityPlayground() {
  const [form] = Form.useForm<ObjectPlaygroundFormValues>();
  const [operation, setOperation] = useState<ObjectPlaygroundOperation>(defaultOperation);
  const [result, setResult] = useState<string>(defaultResultJson);
  const [error, setError] = useState<string | null>(null);

  const initialValues = useMemo(
    () => ({
      source: defaultSourceJson,
      keys: [...defaultKeys],
    }),
    [],
  );

  const handleSubmit = useCallback(
    (values: ObjectPlaygroundFormValues) => {
      const rawSource = values.source?.trim();
      if (!rawSource) {
        setError('Enter a JSON object to transform.');
        setResult('{}');
        return;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawSource);
      } catch (cause) {
        setError('Could not parse JSON. Please ensure the source is valid.');
        return;
      }

      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setError('Source must be a plain JSON object.');
        return;
      }

      const keys = Array.isArray(values.keys) ? values.keys : [];
      const normalizedKeys = keys
        .map((key) => (typeof key === 'string' ? key.trim() : ''))
        .filter((key, index, arr) => key.length > 0 && arr.indexOf(key) === index);

      const record = parsed as Record<PropertyKey, unknown>;
      const transformed =
        operation === 'pick'
          ? pick(record, normalizedKeys as readonly (keyof typeof record)[])
          : omit(record, normalizedKeys as readonly (keyof typeof record)[]);

      setResult(JSON.stringify(transformed, null, 2));
      setError(null);
    },
    [operation],
  );

  const handleReset = useCallback(() => {
    setOperation(defaultOperation);
    setError(null);
    setResult(defaultResultJson);
    form.setFieldsValue({
      source: defaultSourceJson,
      keys: [...defaultKeys],
    });
  }, [form]);

  const handleOperationChange = useCallback(
    (next: ObjectPlaygroundOperation) => {
      setOperation(next);
      setTimeout(() => {
        form.submit();
      }, 0);
    },
    [form],
  );

  return (
    <BaseUtilityPlayground
      triggerText="Open Object Playground"
      triggerIcon={<Text className="text-lg">🧪</Text>}
      title="Object Playground"
      description="Paste any JSON object, choose pick or omit, and edit the key list to see the transformed output."
      onOpen={handleReset}
    >
      {() => (
        <>
          <View className="gap-3">
            <Text className="text-sm font-medium text-foreground">Operation</Text>
            <View className="flex-row gap-2">
              <DocsButton
                type="button"
                variant={operation === 'pick' ? 'default' : 'outline'}
                onClick={() => handleOperationChange('pick')}>
                pick
              </DocsButton>
              <DocsButton
                type="button"
                variant={operation === 'omit' ? 'default' : 'outline'}
                onClick={() => handleOperationChange('omit')}>
                omit
              </DocsButton>
            </View>
          </View>

          <Form form={form} initialValues={initialValues} onFinish={handleSubmit} preserve={false}>
            <Form.Item
              name="source"
              label="Source object"
              rules={[{ required: true, message: 'Please enter a JSON object.' }]}
            >
              <TextInput
                multiline
                numberOfLines={8}
                autoCapitalize="none"
                autoCorrect={false}
                textAlignVertical="top"
                className="border-input bg-background text-foreground font-mono text-xs dark:bg-gray-950 rounded-md border px-3 py-2"
                placeholder={`{
  "id": 1,
  "name": "Ada"
}`}
              />
            </Form.Item>

            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">Keys</Text>
              <Form.List name="keys">
                {(fields, { add, remove }) => (
                  <View className="gap-3">
                    {fields.map((field, index) => {
                      const { key: fieldKey, name: fieldName, ...restFieldProps } = field;

                      return (
                        <View
                          key={fieldKey}
                          className="gap-2 rounded-md border border-border p-3 dark:border-gray-800">
                          <Form.Item
                            {...restFieldProps}
                            name={[fieldName]}
                            label={`Key ${index + 1}`}
                            rules={[{ required: true, message: 'Enter a key name.' }]}
                          >
                            <TextInput
                              autoCapitalize="none"
                              autoCorrect={false}
                              className="border-input bg-background text-foreground rounded-md border px-3 py-2"
                              placeholder="key"
                            />
                          </Form.Item>
                          {fields.length > 1 && (
                            <DocsButton
                              type="button"
                              variant="ghost"
                              className="self-start text-red-500 hover:text-red-600"
                              onClick={() => remove(fieldName)}>
                              Remove
                            </DocsButton>
                          )}
                        </View>
                      );
                    })}
                    <DocsButton type="button" variant="outline" onClick={() => add('')}>
                      Add key
                    </DocsButton>
                  </View>
                )}
              </Form.List>
            </View>
          </Form>

          <View className="flex-row gap-3">
            <DocsButton type="button" onClick={() => form.submit()}>
              Run {operation}
            </DocsButton>
            <DocsButton type="button" variant="outline" onClick={handleReset}>
              Reset
            </DocsButton>
          </View>

          {error ? (
            <Text className="text-sm text-destructive">{error}</Text>
          ) : (
            <View className="gap-2">
              <Text className="text-sm font-medium text-foreground">Result</Text>
              <View className="rounded-md border border-border bg-background/80 p-3 dark:border-gray-800 dark:bg-gray-950/80">
                <Text className="font-mono text-xs text-foreground whitespace-pre-wrap">{result}</Text>
              </View>
            </View>
          )}
        </>
      )}
    </BaseUtilityPlayground>
  );
}
