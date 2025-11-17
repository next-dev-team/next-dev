# RNR Admin - Project Overview

## 🎯 What is RNR Admin?

RNR Admin is a **production-ready admin dashboard starter** inspired by **Ant Design Pro**, built with:
- **Next.js 15** (App Router)
- **React 19**
- **@rnr/registry** for UI components
- **@rnr/rnr-ui** for forms
- **TailwindCSS** + **NativeWind** for styling
- **Zustand** for state management
- **TypeScript** for type safety

## 🚀 Quick Start

```bash
# From the monorepo root
cd apps/rnr-admin

# Install dependencies (if not already installed)
pnpm install

# Start development server
pnpm dev
```

Visit: **http://localhost:3001**

## 📁 Page Structure

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Main dashboard with stats and charts |
| `/analytics` | Analytics page with metrics |
| `/tables/users` | User management table |
| `/tables/products` | Product inventory table |
| `/tables/orders` | Order management table |
| `/forms/basic` | Basic form with validation |
| `/forms/advanced` | Advanced form with dynamic fields |
| `/projects` | Project kanban board view |
| `/settings` | Application settings |
| `/settings/profile` | User profile management |
| `/login` | Login page |
| `/register` | Registration page |
| `/forgot-password` | Password reset flow |

## 🎨 Core Components

### Layout Components (Ant Design Pro Inspired)

#### 1. **ProLayout** (`components/layout/pro-layout.tsx`)
Main wrapper that provides the admin interface structure.

```typescript
import { ProLayout } from '@/components/layout/pro-layout';

export default function AdminLayout({ children }) {
  return <ProLayout>{children}</ProLayout>;
}
```

#### 2. **Header** (`components/layout/header.tsx`)
Top navigation bar featuring:
- Breadcrumb navigation
- Global search
- Theme switcher (dark/light mode)
- Notifications
- User menu with dropdown

#### 3. **Sidebar** (`components/layout/sidebar.tsx`)
Collapsible navigation menu with:
- Menu items with icons
- Active route highlighting
- Nested sub-menus
- Collapse/expand functionality
- Badge support for notifications

#### 4. **PageContainer** (`components/layout/page-container.tsx`)
Page wrapper component that provides:
- Consistent page header
- Breadcrumb management
- Action buttons area
- Back button support
- Standardized spacing

Usage:
```typescript
<PageContainer
  title="Your Page"
  description="Description here"
  breadcrumbs={[
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Your Page' },
  ]}
  actions={
    <Button>Action</Button>
  }
>
  {/* Your content */}
</PageContainer>
```

## 🔧 Technology Stack

### Core
- **Next.js 15.3.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.9.3** - Type safety

### UI & Styling
- **TailwindCSS 3.4.14** - Utility-first CSS
- **NativeWind 4.2.1** - React Native + Tailwind
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants
- **tailwind-merge** - Merge Tailwind classes

**Important**: All UI components are imported via path alias `@/registry/new-york/components/ui/` (configured in `tsconfig.json`) - no local duplicates!

### Forms
- **@rnr/rnr-ui** - Form components
- **rc-field-form** - Form state management

### State Management
- **Zustand 5.0.2** - Global state management

### Workspace Packages
- **@rnr/registry** - UI component library
- **@rnr/rnr-ui** - Form components and utilities

## 📦 Component Architecture

### Direct Package Imports

RNR Admin follows a **zero-duplication** philosophy:

```typescript
// ✅ Good - Import from workspace packages via path aliases
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Form } from '@/rnr-ui/components/ui/forms';

// ❌ Bad - No local UI components folder
// import { Button } from '@/components/ui/button'; // This doesn't exist!
```

**Path Aliases Configuration** (`tsconfig.json`):
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

**Benefits:**
- Single source of truth for all UI components
- Automatic updates when registry components improve
- Type safety across the monorepo
- No maintenance of duplicate components
- Smaller bundle size

## 🎨 Features

### ✅ Dashboard
- Statistics cards with trend indicators (+/-)
- Recent orders list
- Activity feed
- Chart visualization areas (ready for integration)

### ✅ Data Tables
- **Users Table**: User management with roles and status
- **Products Table**: Inventory with stock tracking
- **Orders Table**: Order tracking with status badges
- Search and filter functionality
- Pagination
- Action buttons (view, edit, delete)
- Responsive design

### ✅ Forms
- **Basic Form**: Contact form with validation
- **Advanced Form**: 
  - Multiple sections
  - Dynamic field addition/removal
  - Dropdowns and selects
  - Validation
  - Success feedback

### ✅ Authentication
- Modern login page
- Registration with password confirmation
- Forgot password flow
- Social auth buttons (Google, GitHub)
- Form validation
- Success/error states

### ✅ Settings & Profile
- General settings (company, email)
- Localization (timezone, language)
- Notification preferences (toggles)
- Security settings
- Detailed profile management
- Avatar upload area
- Social links

### ✅ Projects
- Project cards with progress bars
- Status badges
- Team member count
- Due dates
- Grid layout

## 🎯 Design Patterns

### State Management Pattern

```typescript
// lib/store.ts
import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  user: User | null;
  breadcrumbs: Array<{ title: string; href?: string }>;
}

export const useAppStore = create<AppState>()(...);

// Usage in components
function MyComponent() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  // ...
}
```

### Form Pattern (Using @rnr-ui)

```typescript
import { Form } from '@rnr/rnr-ui/components/ui/forms';

function MyForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email required' },
          { type: 'email', message: 'Invalid email' },
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>
      <Button onPress={() => form.submit()}>Submit</Button>
    </Form>
  );
}
```

### Layout Pattern

```typescript
// app/(admin)/layout.tsx
import { ProLayout } from '@/components/layout/pro-layout';

export default function AdminLayout({ children }) {
  return <ProLayout>{children}</ProLayout>;
}

// app/(auth)/layout.tsx
export default function AuthLayout({ children }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
```

## 🔌 Integration Points

### 1. Authentication
Ready for integration with:
- **NextAuth.js** - Full OAuth support
- **Clerk** - Drop-in authentication
- **Supabase Auth** - Backend + auth
- **Firebase Auth** - Google's auth service
- Custom JWT/session auth

### 2. Backend API
Replace mock data with real API calls:

```typescript
// lib/api.ts
export async function getUsers() {
  const response = await fetch('/api/users');
  return response.json();
}

// In component
useEffect(() => {
  getUsers().then(setUsers);
}, []);
```

### 3. Charts & Visualization
Ready for integration with:
- **Recharts** (already included)
- **Chart.js**
- **D3.js**
- **Victory Native**

### 4. Database
Compatible with:
- PostgreSQL
- MySQL
- MongoDB
- Supabase
- Firebase
- Prisma ORM

## 🎨 Customization Guide

### 1. Branding
- Update logo in `components/layout/sidebar.tsx`
- Change colors in `app/globals.css`
- Update metadata in `app/layout.tsx`

### 2. Navigation
- Edit `components/layout/sidebar.tsx` to add/remove menu items
- Update route groups in `app/` directory

### 3. Theme
- Customize color variables in `app/globals.css`
- Light/dark mode colors defined in `:root` and `.dark`

### 4. Add New Pages
1. Create page in `app/(admin)/your-page/page.tsx`
2. Add menu item in `components/layout/sidebar.tsx`
3. Use `PageContainer` for consistent layout

## 📦 Build & Deploy

### Development
```bash
pnpm dev      # Start dev server
pnpm build    # Build for production
pnpm start    # Start production server
```

### Production Build
```bash
pnpm build
# Output in .next/ directory
```

### Deployment Options
- **Vercel** (recommended) - `vercel deploy`
- **Docker** - Use provided Dockerfile
- **Traditional hosting** - Build and serve `.next/`

## 🐛 Common Issues

### Issue: Components not found
**Solution**: Ensure workspace packages are installed
```bash
cd ../.. # Go to monorepo root
pnpm install
```

### Issue: Styles not loading
**Solution**: Make sure Tailwind config includes all paths
```javascript
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  '../../packages/registry/src/**/*.{js,ts,jsx,tsx}',
  '../../packages/rnr-ui/src/**/*.{js,ts,jsx,tsx}',
]
```

### Issue: React Native components error
**Solution**: Check `next.config.mjs` for proper transpilation
```javascript
transpilePackages: [
  'react-native',
  'react-native-web',
  '@rnr/registry',
  '@rnr/rnr-ui',
]
```

## 🎓 Best Practices

1. **Use PageContainer** for all admin pages
2. **Keep state in Zustand store** for global data
3. **Use breadcrumbs** for better navigation
4. **Implement error boundaries** for production
5. **Add loading states** for async operations
6. **Validate forms** before submission
7. **Handle errors gracefully** with user feedback
8. **Use TypeScript** for type safety
9. **Follow component composition** patterns
10. **Keep components small** and focused

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Ant Design Pro](https://pro.ant.design/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## 🤝 Contributing

This is a starter template. Feel free to:
- Customize for your needs
- Add new features
- Improve existing components
- Share improvements

## 📄 License

MIT - Use freely in your projects!

---

**Built with ❤️ using modern web technologies**

