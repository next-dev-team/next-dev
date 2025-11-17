# Quick Start Guide - @rnr/rnr-ui-pro

Get started with RNR UI Pro components in 5 minutes!

## 🚀 Installation

This package is already part of your monorepo. Just import and use!

```bash
# Install dependencies (if needed)
pnpm install
```

## 📦 Import Components

```tsx
import {
  // Forms
  ProForm,
  QueryForm,
  ModalForm,
  
  // Auth
  LoginForm,
  RegisterForm,
  
  // Data Display
  ProCard,
  ProList,
  ProTable,
  ProDescriptions,
  
  // Layout
  PageContainer,
  ProHeader,
} from '@rnr/rnr-ui-pro';
```

## 🎯 Quick Examples

### 1. Simple Login Form (30 seconds)

```tsx
import { LoginForm } from '@rnr/rnr-ui-pro';

export function LoginScreen() {
  return (
    <LoginForm
      onFinish={async (values) => {
        // Your login logic
        console.log(values.email, values.password);
      }}
    />
  );
}
```

### 2. Data Table with Search (2 minutes)

```tsx
import { ProTable } from '@rnr/rnr-ui-pro';

export function UsersTable() {
  const columns = [
    { title: 'Name', dataIndex: 'name', search: true },
    { title: 'Email', dataIndex: 'email', search: true },
  ];

  const data = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
  ];

  return (
    <ProTable
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}
```

### 3. Professional Page Layout (2 minutes)

```tsx
import { PageContainer } from '@rnr/rnr-ui-pro';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';

export function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      breadcrumb={{
        items: [
          { title: 'Home' },
          { title: 'Dashboard' },
        ],
      }}
      extra={<Button>Settings</Button>}
    >
      {/* Your content */}
    </PageContainer>
  );
}
```

### 4. Advanced Form (3 minutes)

```tsx
import { ProForm } from '@rnr/rnr-ui-pro';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';

export function CreatePostForm() {
  return (
    <ProForm
      title="Create Post"
      onFinish={async (values) => {
        // Save post
        console.log(values);
      }}
    >
      <ProForm.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Required' }]}
      >
        <Input />
      </ProForm.Item>

      <ProForm.Item name="content" label="Content">
        <Textarea />
      </ProForm.Item>
    </ProForm>
  );
}
```

### 5. Modal with Form (1 minute)

```tsx
import { ModalForm } from '@rnr/rnr-ui-pro';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';

export function CreateUserButton() {
  return (
    <ModalForm
      title="Create User"
      trigger={<Button>Add User</Button>}
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

## 🎨 Common Patterns

### Pattern 1: CRUD Operations

```tsx
import { ProTable, ModalForm } from '@rnr/rnr-ui-pro';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';

export function UserManagement() {
  const [data, setData] = useState([]);

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Button
          size="sm"
          variant="destructive"
          onPress={() => handleDelete(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={data}
        toolbar={{
          title: 'Users',
          actions: [
            <ModalForm
              key="create"
              title="Create User"
              trigger={<Button>Add User</Button>}
              onFinish={handleCreate}
            >
              <ModalForm.Item name="name" label="Name">
                <Input />
              </ModalForm.Item>
            </ModalForm>,
          ],
        }}
      />
    </>
  );
}
```

### Pattern 2: Dashboard Layout

```tsx
import { PageContainer, ProCard } from '@rnr/rnr-ui-pro';

export function Dashboard() {
  return (
    <PageContainer
      title="Dashboard"
      breadcrumb={{ items: [{ title: 'Home' }, { title: 'Dashboard' }] }}
    >
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProCard title="Users" bordered>
          <Text className="text-3xl font-bold">1,234</Text>
        </ProCard>
        
        <ProCard title="Revenue" bordered>
          <Text className="text-3xl font-bold">$45,678</Text>
        </ProCard>
        
        <ProCard title="Orders" bordered>
          <Text className="text-3xl font-bold">890</Text>
        </ProCard>
      </View>
    </PageContainer>
  );
}
```

### Pattern 3: Search and Filter

```tsx
import { QueryForm, ProTable } from '@rnr/rnr-ui-pro';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';

export function ProductSearch() {
  const [filters, setFilters] = useState({});
  
  return (
    <>
      <QueryForm
        onFinish={setFilters}
        onReset={() => setFilters({})}
      >
        <QueryForm.Item name="keyword">
          <Input placeholder="Search products..." />
        </QueryForm.Item>
      </QueryForm>

      <ProTable
        columns={columns}
        dataSource={filteredData}
        className="mt-4"
      />
    </>
  );
}
```

## 🎓 Learning Path

1. **Start Simple** (Day 1)
   - Use LoginForm or RegisterForm
   - Try ProCard for displaying data
   - Experiment with ProForm

2. **Add Complexity** (Day 2)
   - Implement ProTable with pagination
   - Use ModalForm for CRUD operations
   - Try PageContainer for layouts

3. **Master Advanced Features** (Day 3+)
   - Custom renderers in ProTable
   - QueryForm with complex filters
   - ProDescriptions for detail pages
   - Tabs in ProCard

## 📚 Next Steps

- Read [USAGE.md](./USAGE.md) for detailed usage examples
- Check [COMPONENTS.md](./COMPONENTS.md) for complete API reference
- Explore `src/examples/` for working code examples
- Review the main [README.md](./README.md) for overview

## 🆘 Common Issues

**Issue: Components not styling correctly**
- Solution: Ensure NativeWind is properly configured
- Check that tailwind.config.js includes the pro package path

**Issue: Form validation not working**
- Solution: Make sure you're using rules prop on Form.Item
- Check that rc-field-form is installed

**Issue: TypeScript errors**
- Solution: Install @types/react and @types/react-native
- Update tsconfig.json with proper lib settings

## 💡 Tips

1. **Always use rowKey** in ProTable for better performance
2. **Leverage built-in validation** in forms
3. **Use TypeScript types** for better DX
4. **Compose components** - ProCard can contain ProTable, etc.
5. **Check examples** in src/examples/ directory

## 🎉 You're Ready!

Start building professional UIs with RNR UI Pro components. They're designed to save you time and provide a consistent, high-quality user experience across your entire application.

Happy coding! 🚀

