# Import Guide - RNR Admin

## 🎯 TL;DR

Use path aliases configured in `tsconfig.json`:

```typescript
// ✅ Correct
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Form } from '@/rnr-ui/components/ui/forms';

// ❌ Wrong - package path doesn't work
import { Button } from '@rnr/registry/new-york/components/ui/button';

// ❌ Wrong - no local ui folder
import { Button } from '@/components/ui/button';
```

## 🔧 How It Works

### Path Aliases in `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/registry/*": ["../../packages/registry/src/*"],
      "@/rnr-ui/*": ["../../packages/rnr-ui/src/*"]
    }
  }
}
```

### What Each Alias Does

| Alias | Points To | Use For |
|-------|-----------|---------|
| `@/*` | `./` (app root) | Local app files |
| `@/registry/*` | `../../packages/registry/src/*` | UI components from registry |
| `@/rnr-ui/*` | `../../packages/rnr-ui/src/*` | Form components |

## 📦 Import Patterns

### UI Components

```typescript
// Button
import { Button } from '@/registry/new-york/components/ui/button';

// Input
import { Input } from '@/registry/new-york/components/ui/input';

// Text
import { Text } from '@/registry/new-york/components/ui/text';

// Card
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/registry/new-york/components/ui/card';

// Badge
import { Badge } from '@/registry/new-york/components/ui/badge';

// Avatar
import { Avatar, AvatarImage, AvatarFallback } from '@/registry/new-york/components/ui/avatar';
```

### Form Components

```typescript
// Form with validation
import { Form } from '@/rnr-ui/components/ui/forms';

// Usage
const [form] = Form.useForm();

<Form form={form} onFinish={handleSubmit}>
  <Form.Item name="email" label="Email" rules={[...]}>
    <Input placeholder="Enter email" />
  </Form.Item>
</Form>
```

### Layout Components (Local)

```typescript
// These are in the app, use @/* alias
import { ProLayout } from '@/components/layout/pro-layout';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { PageContainer } from '@/components/layout/page-container';
```

### Utilities

```typescript
// Local utilities
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

// Registry utilities
import { cn } from '@/registry/new-york/lib/utils';
```

## 🚫 Common Mistakes

### ❌ Mistake 1: Using Package Name
```typescript
// Won't work - package doesn't export deep paths
import { Button } from '@rnr/registry/new-york/components/ui/button';
```

**Fix:**
```typescript
// Use path alias instead
import { Button } from '@/registry/new-york/components/ui/button';
```

### ❌ Mistake 2: Local UI Folder
```typescript
// Won't work - this folder doesn't exist
import { Button } from '@/components/ui/button';
```

**Fix:**
```typescript
// Import from registry via path alias
import { Button } from '@/registry/new-york/components/ui/button';
```

### ❌ Mistake 3: Relative Imports
```typescript
// Not recommended - brittle and verbose
import { Button } from '../../packages/registry/src/new-york/components/ui/button';
```

**Fix:**
```typescript
// Use path alias
import { Button } from '@/registry/new-york/components/ui/button';
```

## 🔍 How to Find Components

### 1. Check Available Components
Browse `packages/registry/src/new-york/components/ui/` to see all available components.

### 2. Use TypeScript Autocomplete
Start typing the import and let your editor autocomplete:

```typescript
import { Bu
// Editor suggests: Button, Badge, etc.
```

### 3. Check Documentation
See `COMPONENTS.md` for a complete list of available components with examples.

## 🧪 Verifying Imports

### Check Import Resolution

If you're getting errors, verify:

1. **TypeScript config is correct**
   ```bash
   # Check tsconfig.json has path aliases
   cat apps/rnr-admin/tsconfig.json
   ```

2. **Packages are installed**
   ```bash
   # From monorepo root
   pnpm install
   ```

3. **Next.js config has transpilation**
   ```javascript
   // next.config.mjs
   transpilePackages: [
     '@rnr/registry',
     '@rnr/rnr-ui',
     'react-native',
     'react-native-web',
   ]
   ```

4. **Restart TypeScript server**
   - VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

## 📝 Example: Complete Page

```typescript
'use client';

// Registry components via path alias
import { Input } from '@/registry/new-york/components/ui/input';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardHeader, CardTitle, CardContent } from '@/registry/new-york/components/ui/card';

// Form from rnr-ui via path alias
import { Form } from '@/rnr-ui/components/ui/forms';

// Local components via @/*
import { PageContainer } from '@/components/layout/page-container';
import { useAppStore } from '@/lib/store';

// External packages - normal imports
import { View } from 'react-native';
import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function MyPage() {
  const [form] = Form.useForm();
  const { user } = useAppStore();

  return (
    <PageContainer
      title="My Page"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Page' }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={form} onFinish={(values) => console.log(values)}>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
            <Button onPress={() => form.submit()}>
              <Text className="text-primary-foreground">Submit</Text>
            </Button>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
```

## 🎓 Why This Approach?

### ✅ Advantages

1. **No Duplication** - Single source of truth in packages
2. **Type Safety** - Full TypeScript support across monorepo
3. **Auto Updates** - Changes to registry components benefit all apps
4. **Clean Imports** - Path aliases are clean and consistent
5. **Smaller Bundle** - No duplicate component code

### 📊 Comparison

| Approach | Pros | Cons |
|----------|------|------|
| **Path Aliases** (current) | ✅ No duplication<br>✅ Type safe<br>✅ Auto updates | ⚠️ Requires tsconfig setup |
| Local copies | ✅ Self-contained | ❌ Duplication<br>❌ Manual updates<br>❌ Larger bundle |
| Direct package imports | ✅ Simple | ❌ Doesn't work (no exports)<br>❌ Not supported by packages |

## 🔗 Related Documentation

- `COMPONENTS.md` - Complete component reference
- `GETTING_STARTED.md` - Setup guide
- `OVERVIEW.md` - Architecture details

---

**Remember**: Use `@/registry/*` for UI components and `@/rnr-ui/*` for forms! 🚀

