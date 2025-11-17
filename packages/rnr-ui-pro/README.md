# @rnr/rnr-ui-pro

Professional UI components for React Native Reusables - Inspired by Ant Design Pro

## Features

- 🎨 **Universal Support** - Works on React Native and Web
- 🚀 **High-Level Components** - Pre-built professional components
- 📦 **Built on RNR** - Uses `@rnr/registry` and `@rnr/rnr-ui` as foundation
- 🎯 **Pro-Ready** - Production-ready components for business applications
- 🔧 **Customizable** - Easily extend and customize to your needs

## Components

### Forms
- **ProForm** - Advanced form with layout and submission handling
- **QueryForm** - Form optimized for search/filter operations
- **ModalForm** - Form in a modal dialog
- **LoginForm** - Pre-built authentication form
- **RegisterForm** - Pre-built registration form

### Data Display
- **ProTable** - Advanced table with pagination, search, and actions
- **ProList** - Enhanced list with metadata and actions
- **ProCard** - Advanced card layouts with tabs and actions
- **ProDescriptions** - Description list for displaying data

### Layout
- **PageContainer** - Page wrapper with header and breadcrumb
- **ProHeader** - Professional page header

## Installation

This package is part of the monorepo and uses workspace dependencies.

```bash
pnpm install
```

## Usage

```tsx
import { ProForm, LoginForm, ProTable } from '@rnr/rnr-ui-pro';

// Use pre-built forms
<LoginForm onSubmit={handleLogin} />

// Or build custom pro forms
<ProForm onFinish={handleSubmit}>
  <ProForm.Item name="email" label="Email">
    <Input />
  </ProForm.Item>
</ProForm>
```

## License

MIT

