# Getting Started with RNR Admin

This guide will help you get started with the RNR Admin dashboard template.

## Installation

1. **Navigate to the admin directory:**
```bash
cd apps/rnr-admin
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Start the development server:**
```bash
pnpm dev
```

The admin dashboard will be available at [http://localhost:3001](http://localhost:3001)

## Project Structure

```
apps/rnr-admin/
├── app/                          # Next.js 15 App Directory
│   ├── (admin)/                 # Admin layout group
│   │   ├── dashboard/           # Main dashboard page
│   │   ├── analytics/           # Analytics page
│   │   ├── tables/              # Data tables
│   │   │   ├── users/          # Users table
│   │   │   ├── products/       # Products table
│   │   │   └── orders/         # Orders table
│   │   ├── forms/              # Form pages
│   │   │   ├── basic/          # Basic form example
│   │   │   └── advanced/       # Advanced form with dynamic fields
│   │   ├── projects/           # Projects kanban view
│   │   └── settings/           # Settings pages
│   │       └── profile/        # User profile
│   ├── (auth)/                 # Authentication layout group
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   └── forgot-password/    # Password reset
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Root page (redirects to dashboard)
│   └── globals.css             # Global styles
├── components/
│   ├── layout/                  # Layout components
│   │   ├── pro-layout.tsx      # Main admin layout (inspired by Ant Design Pro)
│   │   ├── header.tsx          # Top navigation header
│   │   ├── sidebar.tsx         # Collapsible sidebar navigation
│   │   └── page-container.tsx  # Page wrapper with breadcrumbs
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx          # Button component
│   │   ├── input.tsx           # Input component
│   │   ├── text.tsx            # Text component
│   │   └── label.tsx           # Label component
│   └── theme-provider.tsx      # Theme provider for dark mode
├── lib/
│   ├── utils.ts                # Utility functions
│   └── store.ts                # Zustand state management
├── hooks/
│   └── use-mobile.tsx          # Mobile detection hooks
└── package.json                # Dependencies and scripts
```

## Key Features

### 1. **Pro Layout System**
Inspired by Ant Design Pro, featuring:
- Collapsible sidebar navigation
- Breadcrumb navigation
- User menu with dropdown
- Theme switcher (light/dark mode)
- Notification center
- Search functionality

### 2. **Dashboard**
- Statistics cards with trend indicators
- Recent orders list
- Activity feed
- Chart placeholders for data visualization

### 3. **Data Tables**
Pre-built tables for:
- **Users**: User management with roles and status
- **Products**: Inventory management with stock tracking
- **Orders**: Order tracking with status updates

Features:
- Search and filters
- Pagination
- Action buttons (view, edit, delete)
- Status badges
- Responsive design

### 4. **Forms**
Two comprehensive form examples:
- **Basic Form**: Simple contact form with validation
- **Advanced Form**: Complex form with:
  - Multiple sections
  - Dynamic field addition/removal
  - Select dropdowns
  - Date pickers
  - Save draft functionality

### 5. **Authentication Pages**
- Modern login page with social auth buttons
- Registration page with password confirmation
- Forgot password flow
- Form validation
- Error handling

### 6. **Settings & Profile**
- General settings
- Localization (timezone, language)
- Notification preferences
- Security options
- Detailed user profile management

## Customization

### Theme

Edit `app/globals.css` to customize colors:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... more color variables */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... more color variables */
}
```

### Navigation

Edit `components/layout/sidebar.tsx` to add/remove menu items:

```typescript
const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  // Add more items...
];
```

### State Management

The app uses Zustand for global state. Edit `lib/store.ts`:

```typescript
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'system',
      user: { /* user data */ },
      // Add more state...
    })
  )
);
```

## Using Components from Packages

**Important**: RNR Admin uses components directly from workspace packages - no duplicate UI components!

### @rnr/registry
UI components from the registry package:

```typescript
// Import UI components via path alias
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card } from '@/registry/new-york/components/ui/card';

// Use them in your components
export default function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  );
}
```

### @rnr/rnr-ui
Form components with validation:

```typescript
import { Form } from '@/rnr-ui/components/ui/forms';
import { Input } from '@/registry/new-york/components/ui/input';

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
          { type: 'email', message: 'Invalid email' }
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>
      <Button onPress={() => form.submit()}>Submit</Button>
    </Form>
  );
}
```

### Available Components from @rnr/registry

All components are available at `@/registry/new-york/components/ui/` (via path alias):

- **button** - Multiple variants (default, destructive, outline, secondary, ghost, link)
- **input** - Text input with error states
- **text** - Typography component
- **label** - Form labels
- **card** - Container components
- **badge** - Status badges
- **avatar** - User avatars
- **separator** - Divider lines
- **progress** - Progress bars
- **skeleton** - Loading placeholders
- **tabs** - Tab navigation
- **dialog** - Modal dialogs
- **dropdown-menu** - Dropdown menus
- **switch** - Toggle switches
- **checkbox** - Checkboxes
- **radio-group** - Radio buttons
- **select** - Select dropdowns
- **textarea** - Multi-line text input
- And many more!

### Why Direct Imports?

✅ **Single source of truth** - All apps use the same components  
✅ **No duplication** - Less code to maintain  
✅ **Automatic updates** - Changes to registry components benefit all apps  
✅ **Consistency** - Same look and feel across all projects  
✅ **Type safety** - TypeScript types are shared

## Adding New Pages

1. Create a new page in `app/(admin)/your-page/page.tsx`:

```typescript
'use client';

import { PageContainer } from '@/components/layout/page-container';

export default function YourPage() {
  return (
    <PageContainer
      title="Your Page"
      description="Page description"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Your Page' },
      ]}
    >
      {/* Your content */}
    </PageContainer>
  );
}
```

2. Add to sidebar navigation in `components/layout/sidebar.tsx`

## Authentication Integration

The authentication pages are ready for integration with:
- NextAuth.js
- Clerk
- Supabase Auth
- Firebase Auth
- Custom auth solution

Example with NextAuth:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## Data Integration

Replace mock data with real API calls:

```typescript
// lib/api.ts
export async function getUsers() {
  const response = await fetch('/api/users');
  return response.json();
}

// In your component
import { useEffect, useState } from 'react';
import { getUsers } from '@/lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  // Render users...
}
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3001
```

## Support

For issues or questions:
- Check the README.md
- Review the component documentation
- Open an issue in the repository

## Next Steps

1. Customize the theme and branding
2. Integrate authentication
3. Connect to your backend API
4. Add data visualization with Recharts
5. Set up form handling with react-hook-form or rc-field-form
6. Deploy to production

Happy coding! 🚀

