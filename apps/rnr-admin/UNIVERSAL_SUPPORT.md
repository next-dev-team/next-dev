# ✨ Universal Platform Support

## 🎯 What is Universal?

All components in this project are **universal** - they work seamlessly on:

- 🌐 **Web** (Next.js via react-native-web)
- 📱 **iOS** (React Native)
- 🤖 **Android** (React Native)

**One codebase, all platforms!**

## 📦 Universal Packages

All our component packages are fully universal:

### 1. `@rnr/registry`

Base UI components (shadcn/ui style)

- ✅ Button, Input, Card, etc.
- ✅ Works on Web, iOS, Android
- ✅ Full NativeWind support

### 2. `@rnr/rnr-ui`

Enhanced UI components

- ✅ Form system with validation
- ✅ Advanced inputs
- ✅ Universal across all platforms

### 3. `@rnr/rnr-ui-pro`

Professional components (Ant Design Pro style)

- ✅ ProTable, ProForm, ProCard
- ✅ Complex data management
- ✅ Works everywhere!

## 🎨 How It Works

### The Magic Stack

```
Your Code (TypeScript + JSX)
    │
    ├─> React Native Components (View, Text, etc.)
    │
    ├─> NativeWind (className="...")
    │
    └─> Platform Specific Rendering
            │
            ├─> Web: react-native-web → HTML + CSS
            ├─> iOS: React Native → Native Views
            └─> Android: React Native → Native Views
```

### Example: Write Once, Run Everywhere

```tsx
import { View, Text, Pressable } from 'react-native';
import { ProCard } from '@rnr/rnr-ui-pro';

function MyComponent() {
  return (
    <ProCard title="Universal Card" className="p-4">
      <View className="flex-row gap-2">
        <Text className="text-lg font-bold">Hello</Text>
        <Pressable className="bg-primary rounded px-4 py-2">
          <Text className="text-white">Click Me</Text>
        </Pressable>
      </View>
    </ProCard>
  );
}
```

This exact same code works on:

- ✅ Next.js (localhost:3001)
- ✅ iOS app
- ✅ Android app

## 🔧 Configuration

### Web (Next.js)

```javascript
// next.config.mjs
transpilePackages: [
  'react-native',
  'react-native-web',
  '@rnr/registry',      // Universal!
  '@rnr/rnr-ui',        // Universal!
  '@rnr/rnr-ui-pro',    // Universal!
],
webpack: (config) => {
  config.resolve.alias = {
    'react-native$': 'react-native-web',
  };
  return config;
}
```

### TypeScript

```typescript
// global.d.ts
declare module 'react-native' {
  export interface ViewProps {
    className?: string; // NativeWind support
  }
  export interface TextProps {
    className?: string;
  }
  // ... etc
}
```

### Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    '../../packages/registry/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/rnr-ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/rnr-ui-pro/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
};
```

## 🚀 Benefits

### No Platform-Specific Code

❌ **Before (with platform-specific code):**

```tsx
import { Platform } from 'react-native';

function MyButton() {
  if (Platform.OS === 'web') {
    return <button>Click</button>;
  }
  return (
    <Pressable>
      <Text>Click</Text>
    </Pressable>
  );
}
```

✅ **After (universal):**

```tsx
import { Button } from '@rnr/registry';

function MyButton() {
  return <Button>Click</Button>;
}
```

### One Design System

- ✅ Same components everywhere
- ✅ Consistent UX across platforms
- ✅ No code duplication
- ✅ Single source of truth

### Shared Business Logic

```tsx
// This works on ALL platforms!
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  return (
    <ProCard title="Profile">
      <Text>{user?.name}</Text>
    </ProCard>
  );
}
```

## 📱 Platform-Specific Features

When you DO need platform-specific code:

```tsx
import { Platform } from 'react-native';

function MyComponent() {
  return (
    <View>
      {Platform.OS === 'web' && <div>Web-only feature</div>}
      {Platform.OS === 'ios' && <View>iOS-only feature</View>}
      {Platform.OS === 'android' && <View>Android-only feature</View>}
    </View>
  );
}
```

But in 95% of cases, you don't need this!

## 🎨 Styling: NativeWind

### Why NativeWind?

NativeWind brings Tailwind CSS to React Native, making it truly universal:

```tsx
// Same className works everywhere!
<View className="flex-row items-center justify-between bg-white p-4 dark:bg-gray-900">
  <Text className="text-lg font-bold text-gray-900 dark:text-white">Title</Text>
  <Button className="bg-primary hover:bg-primary-dark px-4 py-2">Action</Button>
</View>
```

### Features

- ✅ All Tailwind utilities
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Hover, focus, active states (web)
- ✅ Custom variants
- ✅ JIT compilation

## 🔄 No Adapters Needed!

Unlike some frameworks, we don't need web adapters or platform-specific components:

❌ **Wrong approach:**

```tsx
// DON'T create web adapters!
function WebView(props) {
  return <div {...props} />;
}
```

✅ **Right approach:**

```tsx
// Just use React Native components directly!
import { View } from 'react-native';

function MyComponent() {
  return <View className="p-4">Content</View>;
}
```

**Why?** Because `react-native-web` already converts `View` to `div`, `Text` to `span`, etc.!

## 📦 Component Usage

### From @rnr/registry

```tsx
import { Button, Input, Card, Text } from '@rnr/registry';

// All universal! No platform checks needed!
```

### From @rnr/rnr-ui

```tsx
import { Form } from '@rnr/rnr-ui';

// Universal form with validation!
<Form onFinish={handleSubmit}>
  <Form.Item name="email" label="Email">
    <Input />
  </Form.Item>
</Form>;
```

### From @rnr/rnr-ui-pro

```tsx
import { ProTable, ProForm, ProCard } from '@rnr/rnr-ui-pro';

// Professional components, all universal!
```

## 🎯 Development Workflow

### 1. Write Once

```tsx
function MyFeature() {
  return (
    <ProCard title="Feature">
      <Button>Action</Button>
    </ProCard>
  );
}
```

### 2. Test on Web

```bash
cd apps/rnr-admin
pnpm dev
# Open http://localhost:3001
```

### 3. Test on Mobile (if needed)

```bash
cd apps/mobile  # or wherever your mobile app is
npx expo start
```

### 4. Deploy

All platforms use the same code!

## ✨ Best Practices

1. **Always use React Native components**: `View`, `Text`, `Pressable`, etc.
2. **Never use HTML tags directly**: No `<div>`, `<span>`, `<button>` in shared code
3. **Use NativeWind for styling**: `className` instead of `style`
4. **Import from universal packages**: `@rnr/registry`, `@rnr/rnr-ui`, `@rnr/rnr-ui-pro`
5. **Avoid Platform.select** unless absolutely necessary

## 🎉 Result

With universal support:

- ✅ **One codebase** for all platforms
- ✅ **No adapters** or wrappers needed
- ✅ **Consistent UX** everywhere
- ✅ **Faster development** - write once, deploy everywhere
- ✅ **Easier maintenance** - fix once, fixed everywhere
- ✅ **Better quality** - shared components = shared quality

**True universal development! 🚀**
