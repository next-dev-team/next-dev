import { cn } from '@/registry/new-york/lib/utils';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import { Checkbox } from '@/registry/new-york/components/ui/checkbox';
import { Icon } from '@/registry/new-york/components/ui/icon';
import * as React from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoScreen() {
  const [todos, setTodos] = React.useState<TodoItem[]>([
    { id: '1', text: 'Welcome to the Todo App!', completed: false },
    { id: '2', text: 'Add new todos using the input below', completed: false },
    { id: '3', text: 'Tap to mark items as complete', completed: true },
    // Test cases for different content lengths
    {
      id: '4',
      text: 'This is a very long todo item to test how the layout handles longer text content that might wrap to multiple lines',
      completed: false,
    },
    { id: '5', text: 'Short', completed: true },
    { id: '6', text: 'Medium length todo item for testing', completed: false },
  ]);
  const [inputText, setInputText] = React.useState('');
  const [deleteConfirm, setDeleteConfirm] = React.useState<{ id: string; text: string } | null>(
    null,
  );

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputText('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const deleteTodo = (id: string) => {
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (!todoToDelete) return;

    setDeleteConfirm({ id, text: todoToDelete.text });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setTodos(todos.filter((todo) => todo.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <View className="bg-background flex-1">
      {/* Simple scrollable content */}
      <ScrollView className="android:pb-24 ios:pb-28 flex-1">
        <View className="px-4">
          {/* Content wrapper with max width for better readability */}
          <View className="mx-auto w-full max-w-lg">
            {/* Header with stats */}
            <View className="bg-muted mb-4 rounded-lg p-4">
              <Text className="text-muted-foreground text-center text-sm">
                {completedCount} of {totalCount} completed
              </Text>
            </View>

            {/* Add Todo Section */}
            <View className="mb-4 flex-row">
              <Input
                placeholder="Add a new todo..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={addTodo}
                returnKeyType="done"
                className="mr-2 flex-1"
              />
              <Button onPress={addTodo} size="sm">
                <Icon as={Plus} className="size-3.5 text-white" />
                <Text className="ml-1 text-sm text-white">Add</Text>
              </Button>
            </View>

            {/* Todo List or Empty State */}
            {todos.length > 0 ? (
              <View className="space-y-2">
                {todos.map((todo) => (
                  <TouchableOpacity
                    key={todo.id}
                    onPress={() => toggleTodo(todo.id)}
                    className={cn(
                      'bg-card flex-row items-center rounded-lg border p-4',
                      todo.completed && 'opacity-60',
                    )}
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="mr-3"
                    />
                    <Text
                      className={cn(
                        'flex-1 text-base',
                        todo.completed && 'text-muted-foreground line-through',
                      )}
                    >
                      {todo.text}
                    </Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={(e) => {
                        e.stopPropagation();
                        deleteTodo(todo.id);
                      }}
                      className="ml-2 h-8 w-8 p-1"
                    >
                      <Icon as={Trash2} className="text-destructive size-3.5" />
                    </Button>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="items-center py-16">
                <Text className="text-muted-foreground mb-2 text-center text-lg">
                  No todos yet!
                </Text>
                <Text className="text-muted-foreground text-center text-sm">
                  Add your first todo above to get started
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Dialog - Always centered */}
      {deleteConfirm && (
        <View className="absolute inset-0 items-center justify-center bg-black/50">
          <View className="bg-card mx-4 w-full max-w-sm rounded-lg p-6">
            <Text className="mb-3 text-center text-xl font-semibold">Delete Todo</Text>
            <Text className="text-muted-foreground mb-6 text-center">
              Are you sure you want to delete "{deleteConfirm.text}"?
            </Text>
            <View className="flex-row justify-center space-x-3">
              <Button variant="ghost" size="default" onPress={cancelDelete}>
                <Text>Cancel</Text>
              </Button>
              <Button variant="destructive" size="default" onPress={confirmDelete}>
                <Text>Delete</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
