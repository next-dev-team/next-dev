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
