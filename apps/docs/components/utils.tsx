'use client';
import { hello, helloAsync } from '@rnr/utils';
import { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';

export function HelloDemo() {
  const [syncResult, setSyncResult] = useState<string>('');
  const [asyncResult, setAsyncResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const runSyncExample = () => {
    const result = hello('React Native');
    setSyncResult(result);
  };

  const runAsyncExample = async () => {
    setLoading(true);
    const result = await helloAsync('Developer');
    setAsyncResult(result);
    setLoading(false);
  };

  useEffect(() => {
    runSyncExample();
  }, []);

  return (
    <View className="gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
      <View className="gap-2">
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Synchronous Example:
        </Text>
        <View className="rounded border bg-white p-3 dark:bg-gray-800">
          <Text className="font-mono text-sm text-gray-800 dark:text-gray-200">
            Input: hello('React Native')
          </Text>
          <Text className="mt-1 font-mono text-sm text-green-600 dark:text-green-400">
            Output: "{syncResult}"
          </Text>
        </View>
        <Button title="Run Sync Example" onPress={runSyncExample} />
      </View>

      <View className="gap-2">
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Asynchronous Example:
        </Text>
        <View className="rounded border bg-white p-3 dark:bg-gray-800">
          <Text className="font-mono text-sm text-gray-800 dark:text-gray-200">
            Input: await helloAsync('Developer')
          </Text>
          <Text className="mt-1 font-mono text-sm text-green-600 dark:text-green-400">
            Output: "{loading ? 'Loading...' : asyncResult}"
          </Text>
        </View>
        <Button
          title={loading ? 'Loading...' : 'Run Async Example'}
          onPress={runAsyncExample}
          disabled={loading}
        />
      </View>
    </View>
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
