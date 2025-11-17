# @rnr/rnr-ui-pro Usage Guide

Comprehensive guide for using RNR UI Pro components in your application.

## Table of Contents

- [Installation](#installation)
- [Components](#components)
  - [Forms](#forms)
  - [Auth Forms](#auth-forms)
  - [Data Display](#data-display)
  - [Layout](#layout)
- [Examples](#examples)

## Installation

This package is part of the monorepo workspace. It uses:
- `@rnr/registry` - Base UI components
- `@rnr/rnr-ui` - Form components

```bash
# Install dependencies
pnpm install
```

## Components

### Forms

#### ProForm

Advanced form component with built-in layout and submission handling.

```tsx
import { ProForm } from '@rnr/rnr-ui-pro';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';

function MyForm() {
  const handleSubmit = async (values) => {
    console.log('Form values:', values);
    // Handle submission
  };

  return (
    <ProForm
      title="Create New Post"
      description="Fill in the form below"
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ title: '' }}
    >
      <ProForm.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Required' }]}
      >
        <Input placeholder="Enter title" />
      </ProForm.Item>
    </ProForm>
  );
}
```

**Props:**
- `title` - Form title
- `description` - Form description
- `layout` - Form layout: `vertical`, `horizontal`, `inline`
- `onFinish` - Callback when form is submitted successfully
- `initialValues` - Initial form values
- `loading` - Show loading state
- `submitter` - Custom submit buttons or `false` to hide

#### QueryForm

Optimized form for search/filter operations with collapsible fields.

```tsx
import { QueryForm } from '@rnr/rnr-ui-pro';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';

function SearchForm() {
  const handleSearch = (values) => {
    console.log('Search:', values);
  };

  return (
    <QueryForm onFinish={handleSearch}>
      <QueryForm.Item name="keyword" label="Keyword">
        <Input placeholder="Search..." />
      </QueryForm.Item>
    </QueryForm>
  );
}
```

#### ModalForm

Form displayed in a modal dialog - perfect for create/edit operations.

```tsx
import { ModalForm } from '@rnr/rnr-ui-pro';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';

function CreateUserModal() {
  return (
    <ModalForm
      title="Create User"
      trigger={<Button><Text>Add User</Text></Button>}
      onFinish={async (values) => {
        // Create user
      }}
    >
      <ModalForm.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </ModalForm.Item>
    </ModalForm>
  );
}
```

### Auth Forms

#### LoginForm

Pre-built authentication form with email/password.

```tsx
import { LoginForm } from '@rnr/rnr-ui-pro';

function LoginPage() {
  const handleLogin = async (values) => {
    // Authenticate user
    console.log(values.email, values.password, values.remember);
  };

  return (
    <LoginForm
      onFinish={handleLogin}
      showRememberMe
      showForgotPassword
      onForgotPassword={() => {
        // Navigate to forgot password
      }}
    />
  );
}
```

#### RegisterForm

Pre-built registration form with validation.

```tsx
import { RegisterForm } from '@rnr/rnr-ui-pro';

function RegisterPage() {
  const handleRegister = async (values) => {
    // Create account
    console.log(values);
  };

  return (
    <RegisterForm
      onFinish={handleRegister}
      showTermsAndConditions
      onTermsClick={() => {
        // Show terms modal
      }}
    />
  );
}
```

### Data Display

#### ProCard

Advanced card component with tabs, actions, and collapsible support.

```tsx
import { ProCard } from '@rnr/rnr-ui-pro';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';

function Dashboard() {
  return (
    <ProCard
      title="Statistics"
      subTitle="Last 30 days"
      extra={<Button>Refresh</Button>}
      headerBordered
      hoverable
      actions={[
        <Button key="view">View Details</Button>,
        <Button key="export">Export</Button>,
      ]}
    >
      <Text>Card content here</Text>
    </ProCard>
  );
}
```

**With Tabs:**

```tsx
<ProCard
  tabs={{
    tabList: [
      { key: 'overview', tab: 'Overview' },
      { key: 'details', tab: 'Details' },
    ],
    activeKey: 'overview',
    onChange: (key) => console.log(key),
  }}
>
  <Text>Tab content</Text>
</ProCard>
```

#### ProList

Enhanced list component with metadata and actions.

```tsx
import { ProList } from '@rnr/rnr-ui-pro';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';

function UserList() {
  const data = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <ProList
      dataSource={data}
      metas={{
        title: {
          dataIndex: 'name',
        },
        description: {
          dataIndex: 'email',
        },
        actions: {
          render: (item) => [
            <Button key="edit" size="sm">Edit</Button>,
            <Button key="delete" size="sm" variant="destructive">Delete</Button>,
          ],
        },
      }}
      pagination={{
        pageSize: 10,
      }}
    />
  );
}
```

#### ProTable

Advanced table with search, pagination, and sorting.

```tsx
import { ProTable } from '@rnr/rnr-ui-pro';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';

function UserTable() {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      search: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      search: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button size="sm">Edit</Button>
      ),
    },
  ];

  const data = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
  ];

  return (
    <ProTable
      columns={columns}
      dataSource={data}
      rowKey="id"
      search={{
        searchText: 'Search',
        resetText: 'Reset',
      }}
      toolbar={{
        title: 'Users',
        actions: [<Button key="add">Add User</Button>],
      }}
      pagination={{
        pageSize: 10,
      }}
    />
  );
}
```

#### ProDescriptions

Advanced description list for displaying structured data.

```tsx
import { ProDescriptions, createDescriptionsItems } from '@rnr/rnr-ui-pro';

function UserProfile() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    createdAt: '2024-01-15',
  };

  const items = createDescriptionsItems([
    { label: 'Name', dataIndex: 'name' },
    { label: 'Email', dataIndex: 'email' },
    { label: 'Role', dataIndex: 'role' },
    {
      label: 'Created',
      dataIndex: 'createdAt',
      valueType: 'date',
    },
  ]);

  return (
    <ProDescriptions
      title="User Details"
      bordered
      column={2}
      dataSource={user}
      items={items}
    />
  );
}
```

### Layout

#### PageContainer

Professional page wrapper with header and breadcrumb.

```tsx
import { PageContainer } from '@rnr/rnr-ui-pro';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';

function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      subTitle="Welcome back!"
      breadcrumb={{
        items: [
          { title: 'Home', onPress: () => navigate('/') },
          { title: 'Dashboard' },
        ],
      }}
      extra={<Button>Settings</Button>}
      tabList={[
        { key: 'overview', tab: 'Overview' },
        { key: 'analytics', tab: 'Analytics' },
      ]}
      tabActiveKey="overview"
      onTabChange={(key) => console.log(key)}
    >
      {/* Page content */}
    </PageContainer>
  );
}
```

#### ProHeader

Professional page header component.

```tsx
import { ProHeader } from '@rnr/rnr-ui-pro';
import { Badge } from '@rnr/registry/src/new-york/components/ui/badge';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';

function Header() {
  return (
    <ProHeader
      title="Project Dashboard"
      subTitle="Manage your projects efficiently"
      tags={
        <>
          <Badge>Active</Badge>
          <Badge variant="secondary">5 Projects</Badge>
        </>
      }
      extra={<Button>New Project</Button>}
    />
  );
}
```

## Examples

Check the `src/examples` directory for complete examples:

- `pro-form-example.tsx` - ProForm with validation
- `login-form-example.tsx` - Complete login page
- `pro-table-example.tsx` - Data table with search
- `page-container-example.tsx` - Full page layout

## Best Practices

1. **Form Validation**: Always use validation rules for user input
2. **Loading States**: Show loading indicators during async operations
3. **Error Handling**: Implement proper error handling in form submissions
4. **Responsive Design**: Use appropriate column counts for different screen sizes
5. **Accessibility**: Provide proper labels and ARIA attributes

## Universal Support

All components are designed to work seamlessly on:
- React Native (iOS/Android)
- React Native Web
- Expo

Components automatically adapt to the platform they're running on.

## TypeScript Support

All components are fully typed with TypeScript. Use the exported types for better development experience:

```tsx
import type { ProFormProps, LoginFormValues, ProTableColumn } from '@rnr/rnr-ui-pro';
```

## License

MIT

