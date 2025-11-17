# Component Import Guide

## ⚡ Quick Reference

RNR Admin uses **direct imports** from workspace packages. There is **NO** `components/ui/` folder in this app.

## ✅ Correct Imports

### UI Components (from @registry via path alias)

```typescript
// Button component
import { Button } from '@/registry/new-york/components/ui/button';

// Input component
import { Input } from '@/registry/new-york/components/ui/input';

// Text component
import { Text } from '@/registry/new-york/components/ui/text';

// Card components
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/registry/new-york/components/ui/card';

// Label component
import { Label } from '@/registry/new-york/components/ui/label';

// Badge component
import { Badge } from '@/registry/new-york/components/ui/badge';

// Avatar components
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from '@/registry/new-york/components/ui/avatar';
```

### Form Components (from @rnr-ui via path alias)

```typescript
// Form component with validation
import { Form } from '@/rnr-ui/components/ui/forms';
```

**Note**: The `@/registry/*` and `@/rnr-ui/*` path aliases are configured in `tsconfig.json` to point to the workspace packages.

### Layout Components (local to admin app)

```typescript
// These are specific to the admin app
import { ProLayout } from '@/components/layout/pro-layout';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { PageContainer } from '@/components/layout/page-container';
```

## ❌ Incorrect Imports (These Don't Exist!)

```typescript
// ❌ Wrong - This folder doesn't exist
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
```

## 📚 Complete Component List from Registry

All available at `@/registry/new-york/components/ui/` (via path alias):

### Input & Forms
- `input` - Text input fields
- `textarea` - Multi-line text input
- `label` - Form labels
- `checkbox` - Checkboxes
- `radio-group` - Radio button groups
- `select` - Dropdown selects
- `switch` - Toggle switches

### Buttons & Actions
- `button` - Primary action buttons
- `toggle` - Toggle buttons
- `toggle-group` - Toggle button groups

### Display & Feedback
- `text` - Typography component
- `badge` - Status badges
- `avatar` - User avatars
- `card` - Container cards
- `alert` - Alert messages
- `progress` - Progress bars
- `skeleton` - Loading skeletons
- `separator` - Divider lines

### Overlays & Dialogs
- `dialog` - Modal dialogs
- `alert-dialog` - Alert dialogs
- `popover` - Popovers
- `tooltip` - Tooltips
- `hover-card` - Hover cards
- `dropdown-menu` - Dropdown menus
- `context-menu` - Context menus
- `menubar` - Menu bars

### Navigation
- `tabs` - Tab navigation
- `navigation-menu` - Navigation menus

### Layout
- `accordion` - Collapsible sections
- `collapsible` - Collapsible containers
- `aspect-ratio` - Aspect ratio containers

## 🎯 Usage Examples

### Basic Form with Validation

```typescript
'use client';

import { View } from 'react-native';
import { Input } from '@/registry/new-york/components/ui/input';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Label } from '@/registry/new-york/components/ui/label';
import { Form } from '@/rnr-ui/components/ui/forms';

export default function MyForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Submitted:', values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Invalid email' }
        ]}
      >
        <Input 
          placeholder="Enter email" 
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Form.Item>
      
      <Button onPress={() => form.submit()}>
        <Text className="text-primary-foreground">Submit</Text>
      </Button>
    </Form>
  );
}
```

### Card with Content

```typescript
import { View } from 'react-native';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/registry/new-york/components/ui/card';
import { Badge } from '@/registry/new-york/components/ui/badge';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function UserCard() {
  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-center justify-between">
          <CardTitle>John Doe</CardTitle>
          <Badge>Admin</Badge>
        </View>
        <CardDescription>john@example.com</CardDescription>
      </CardHeader>
      <CardContent>
        <Text className="text-muted-foreground mb-4">
          Member since January 2024
        </Text>
        <Button variant="outline">
          <Text>View Profile</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Button Variants

```typescript
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function ButtonExamples() {
  return (
    <>
      {/* Default primary button */}
      <Button>
        <Text className="text-primary-foreground">Primary</Text>
      </Button>

      {/* Outline variant */}
      <Button variant="outline">
        <Text>Outline</Text>
      </Button>

      {/* Destructive variant */}
      <Button variant="destructive">
        <Text className="text-destructive-foreground">Delete</Text>
      </Button>

      {/* Ghost variant */}
      <Button variant="ghost">
        <Text>Ghost</Text>
      </Button>

      {/* Link variant */}
      <Button variant="link">
        <Text>Link</Text>
      </Button>
    </>
  );
}
```

## 🏗️ Architecture Benefits

### ✅ Advantages

1. **Single Source of Truth**
   - All apps use the same components from `@rnr/registry`
   - Updates to registry benefit all apps instantly

2. **No Duplication**
   - Zero duplicate code
   - Smaller bundle size
   - Less maintenance overhead

3. **Type Safety**
   - TypeScript types shared across monorepo
   - Better autocomplete and intellisense
   - Catch errors at compile time

4. **Consistency**
   - Same look and feel across all projects
   - Unified design system
   - Easier onboarding for developers

5. **Easy Updates**
   - Update component in one place
   - All apps get the improvement
   - No need to sync changes

### 📂 Project Structure

```
apps/rnr-admin/
├── components/
│   ├── layout/           # Admin-specific layout components
│   │   ├── pro-layout.tsx
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── page-container.tsx
│   └── theme-provider.tsx
├── app/                  # Next.js pages
└── ... (no ui/ folder!)

packages/
├── registry/
│   └── src/
│       └── new-york/
│           └── components/
│               └── ui/    # ← All UI components here!
└── rnr-ui/
    └── src/
        └── components/
            └── ui/        # ← Form components here!
```

## 🔍 Finding Components

### In Your Editor

With TypeScript, you get full autocomplete:

```typescript
// Type this:
import { Bu

// Autocomplete suggests:
// - Button from '@rnr/registry/new-york/components/ui/button'
// - Badge from '@rnr/registry/new-york/components/ui/badge'
// etc.
```

### In the Repository

Browse components directly:
- UI Components: `packages/registry/src/new-york/components/ui/`
- Form Components: `packages/rnr-ui/src/components/ui/`

## 💡 Tips

1. **Use Path Aliases**
   ```typescript
   // ✅ Good - Use path alias configured in tsconfig.json
   import { Button } from '@/registry/new-york/components/ui/button';
   
   // ❌ Bad - Direct package import (won't work)
   import { Button } from '@rnr/registry/new-york/components/ui/button';
   ```

2. **Check Available Props**
   - Hover over components in your editor
   - TypeScript will show all available props
   - Most components accept className for styling

3. **Path Aliases Configured**
   The imports work because `tsconfig.json` has:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/registry/*": ["../../packages/registry/src/*"],
         "@/rnr-ui/*": ["../../packages/rnr-ui/src/*"]
       }
     }
   }
   ```

4. **Styling with Tailwind**
   ```typescript
   <Button className="w-full bg-blue-500">
     <Text className="text-white">Custom Styled</Text>
   </Button>
   ```

5. **Variant Props**
   ```typescript
   // Many components have variant props
   <Button variant="outline" size="lg">
     <Text>Large Outline Button</Text>
   </Button>
   ```

## 🆘 Troubleshooting

### Import Errors?

```bash
# Make sure packages are installed
cd ../..  # Go to monorepo root
pnpm install
```

### Component Not Found?

1. Check the component exists in `packages/registry/src/new-york/components/ui/`
2. Verify the import path is correct
3. Ensure TypeScript is configured correctly in `tsconfig.json`

### Type Errors?

1. Restart TypeScript server in your editor
2. Check `next.config.mjs` has `@rnr/registry` in `transpilePackages`
3. Verify workspace dependencies are linked

---

**Remember**: No local `components/ui/` folder! All UI components come from workspace packages. 🎉

