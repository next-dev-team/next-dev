# @rnr/rnr-ui-pro Component Reference

Complete reference guide for all components in RNR UI Pro.

## 📋 Component Overview

### Form Components
- **ProForm** - Advanced form with layout options and submission handling
- **QueryForm** - Search/filter form with collapsible fields
- **ModalForm** - Form inside a modal dialog

### Pre-built Auth Forms
- **LoginForm** - Ready-to-use login form with email/password
- **RegisterForm** - Ready-to-use registration form with validation

### Data Display Components
- **ProCard** - Advanced card with tabs, actions, and collapse
- **ProList** - Enhanced list with metadata and pagination
- **ProTable** - Data table with search, sort, and pagination
- **ProDescriptions** - Structured data display

### Layout Components
- **PageContainer** - Page wrapper with header and breadcrumb
- **ProHeader** - Professional page header

---

## Form Components

### ProForm

**Purpose:** Advanced form component for complex data entry

**Key Features:**
- Multiple layout options (vertical, horizontal, inline)
- Built-in submit/reset buttons
- Loading states
- Custom submitter support
- Title and description display

**Dependencies:**
- `@rnr/rnr-ui` - Form component
- `@rnr/registry` - Button, Text

**Usage:**
```tsx
<ProForm
  title="Create Post"
  layout="vertical"
  onFinish={handleSubmit}
  loading={isSubmitting}
>
  <ProForm.Item name="title" label="Title" rules={[{ required: true }]}>
    <Input />
  </ProForm.Item>
</ProForm>
```

---

### QueryForm

**Purpose:** Optimized form for search and filter operations

**Key Features:**
- Horizontal layout by default
- Quick search/reset buttons
- Collapsible fields support
- Minimal styling for toolbar usage

**Dependencies:**
- `@rnr/rnr-ui` - Form component
- `@rnr/registry` - Button, Text

**Usage:**
```tsx
<QueryForm
  onFinish={handleSearch}
  onReset={handleReset}
>
  <QueryForm.Item name="keyword">
    <Input placeholder="Search..." />
  </QueryForm.Item>
</QueryForm>
```

---

### ModalForm

**Purpose:** Form displayed in a modal dialog for create/edit actions

**Key Features:**
- Modal dialog integration
- Trigger element support
- Automatic modal close on success
- Custom dialog content

**Dependencies:**
- `@rnr/rnr-ui` - Form component
- `@rnr/registry` - Dialog, Button, Text

**Usage:**
```tsx
<ModalForm
  title="Edit User"
  trigger={<Button>Edit</Button>}
  onFinish={handleUpdate}
>
  <ModalForm.Item name="name" label="Name">
    <Input />
  </ModalForm.Item>
</ModalForm>
```

---

## Pre-built Auth Forms

### LoginForm

**Purpose:** Ready-to-use authentication form

**Key Features:**
- Email and password fields
- Remember me checkbox
- Forgot password link
- Built-in validation
- Customizable labels and text

**Dependencies:**
- `@rnr/rnr-ui` - Form component
- `@rnr/registry` - Input, Button, Checkbox, Label, Text

**Form Values:**
```tsx
interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}
```

**Usage:**
```tsx
<LoginForm
  onFinish={handleLogin}
  showRememberMe
  showForgotPassword
  onForgotPassword={() => navigate('/forgot-password')}
/>
```

---

### RegisterForm

**Purpose:** Ready-to-use registration form

**Key Features:**
- Name, email, password fields
- Password confirmation with validation
- Terms and conditions checkbox
- Built-in validation rules
- Customizable labels and text

**Dependencies:**
- `@rnr/rnr-ui` - Form component
- `@rnr/registry` - Input, Button, Checkbox, Label, Text

**Form Values:**
```tsx
interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms?: boolean;
}
```

**Usage:**
```tsx
<RegisterForm
  onFinish={handleRegister}
  showTermsAndConditions
  onTermsClick={() => showTermsModal()}
/>
```

---

## Data Display Components

### ProCard

**Purpose:** Advanced card component for flexible content layout

**Key Features:**
- Header with title, subtitle, and extra content
- Tab support for multiple views
- Action buttons in footer
- Collapsible content
- Bordered/ghost variants
- Hoverable effect
- Split layout (vertical/horizontal)

**Dependencies:**
- `@rnr/registry` - Card, Text, Tabs, Separator

**Usage:**
```tsx
<ProCard
  title="Statistics"
  subTitle="Last 30 days"
  extra={<Button>Refresh</Button>}
  tabs={{
    tabList: [
      { key: 'tab1', tab: 'Overview' },
      { key: 'tab2', tab: 'Details' },
    ],
  }}
  actions={[
    <Button key="action1">Export</Button>,
  ]}
  hoverable
  bordered
>
  <Text>Content</Text>
</ProCard>
```

---

### ProList

**Purpose:** Enhanced list component with rich metadata

**Key Features:**
- Customizable item rendering
- Avatar, title, subtitle, description support
- Action buttons per item
- Pagination support
- Grid layout option
- Size variants (small, default, large)
- Header and footer slots
- Loading state

**Dependencies:**
- `@rnr/registry` - Card, Text, Button, Separator

**Usage:**
```tsx
<ProList
  dataSource={users}
  metas={{
    title: { dataIndex: 'name' },
    description: { dataIndex: 'email' },
    actions: {
      render: (item) => [
        <Button key="edit">Edit</Button>,
      ],
    },
  }}
  pagination={{ pageSize: 10 }}
  bordered
/>
```

---

### ProTable

**Purpose:** Feature-rich data table component

**Key Features:**
- Column-based configuration
- Search functionality
- Sorting (client-side)
- Pagination
- Custom cell rendering
- Row actions
- Toolbar with title and actions
- Loading state
- Empty state

**Dependencies:**
- `@rnr/registry` - Card, Text, Button, Input, Separator

**Column Configuration:**
```tsx
interface ProTableColumn {
  title: ReactNode;
  dataIndex?: string;
  key?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean | ((a, b) => number);
  render?: (value, record, index) => ReactNode;
  search?: boolean;
}
```

**Usage:**
```tsx
<ProTable
  columns={[
    {
      title: 'Name',
      dataIndex: 'name',
      search: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Actions',
      render: (_, record) => <Button>Edit</Button>,
    },
  ]}
  dataSource={data}
  rowKey="id"
  search={{ searchText: 'Search' }}
  pagination={{ pageSize: 10 }}
  toolbar={{
    title: 'Users',
    actions: [<Button key="add">Add</Button>],
  }}
/>
```

---

### ProDescriptions

**Purpose:** Display structured data in a description list format

**Key Features:**
- Multiple column layouts
- Bordered/borderless variants
- Horizontal/vertical layout
- Custom value rendering
- Built-in value type formatting (date, money, percent)
- Span support for items
- Size variants
- Loading state

**Dependencies:**
- `@rnr/registry` - Card, Text, Separator

**Item Configuration:**
```tsx
interface ProDescriptionsItem {
  label: ReactNode;
  dataIndex?: string;
  span?: number;
  render?: (value, record) => ReactNode;
  valueType?: 'text' | 'date' | 'dateTime' | 'money' | 'percent';
}
```

**Usage:**
```tsx
<ProDescriptions
  title="User Details"
  column={2}
  bordered
  dataSource={user}
  items={[
    { label: 'Name', dataIndex: 'name' },
    { label: 'Email', dataIndex: 'email' },
    {
      label: 'Salary',
      dataIndex: 'salary',
      valueType: 'money',
    },
  ]}
/>
```

---

## Layout Components

### PageContainer

**Purpose:** Professional page wrapper with consistent layout

**Key Features:**
- Page title and subtitle
- Breadcrumb navigation
- Header with avatar and tags
- Extra content slot
- Tab navigation
- Content area
- Footer slot
- Loading state
- Ghost mode (no styling)

**Dependencies:**
- `@rnr/registry` - Text, Button, Separator

**Usage:**
```tsx
<PageContainer
  title="Dashboard"
  subTitle="Welcome back"
  breadcrumb={{
    items: [
      { title: 'Home', onPress: () => {} },
      { title: 'Dashboard' },
    ],
  }}
  header={{
    tags: <Badge>Active</Badge>,
    extra: <Button>Settings</Button>,
  }}
  tabList={[
    { key: 'tab1', tab: 'Overview' },
  ]}
  tabActiveKey="tab1"
>
  <Text>Page content</Text>
</PageContainer>
```

---

### ProHeader

**Purpose:** Professional page header component

**Key Features:**
- Title and subtitle
- Avatar support
- Tags/badges display
- Extra content slot
- Content area
- Footer area
- Ghost mode

**Dependencies:**
- `@rnr/registry` - Text, Separator

**Usage:**
```tsx
<ProHeader
  title="Project Dashboard"
  subTitle="Manage your projects"
  tags={
    <>
      <Badge>Active</Badge>
      <Badge variant="secondary">5 Projects</Badge>
    </>
  }
  extra={<Button>New Project</Button>}
  content={
    <Text>Additional header content</Text>
  }
  footer={
    <Text>Footer content</Text>
  }
/>
```

---

## Universal Platform Support

All components are designed to work seamlessly across:
- ✅ React Native (iOS)
- ✅ React Native (Android)
- ✅ React Native Web
- ✅ Expo

Components automatically adapt their behavior based on the platform.

---

## Styling

All components use:
- **NativeWind** for styling
- **Tailwind CSS** classes
- **class-variance-authority** for variants
- Platform-specific adaptations when needed

---

## TypeScript

All components are fully typed with comprehensive TypeScript support:
- Props interfaces exported
- Generic type support where applicable
- Strict type checking
- IntelliSense support

---

## Accessibility

Components follow accessibility best practices:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management

---

## Performance

Components are optimized for performance:
- Memoization where appropriate
- Efficient re-rendering
- Lazy loading support
- Virtual scrolling in lists/tables

---

## Customization

All components support:
- Custom className
- Custom style props
- Children composition
- Render props pattern
- Custom renderers

---

## Dependencies Summary

**Core Dependencies:**
- `@rnr/registry` - Base UI components (Button, Input, Card, etc.)
- `@rnr/rnr-ui` - Form component
- `react` and `react-native` - Core frameworks
- `nativewind` - Styling
- `class-variance-authority` - Variant handling
- `tailwind-merge` - Class merging

**No External Service Dependencies** - All components work offline and don't require external APIs.

---

## License

MIT - Feel free to use in commercial projects.

