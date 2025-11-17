# Layout Components

This directory contains layout components that work seamlessly with both React Native and Web (Next.js) using NativeWind.

## Components

### PageContainer (Recommended for existing pages)
Simple page container that uses **ProHeader** from `@rnr/rnr-ui-pro` internally.

**Features:**
- Title and description
- Back button
- Actions/buttons
- Tags and avatar support
- Footer support
- Maintains compatibility with existing pages

**Usage:**
```tsx
import { PageContainer } from '@/components/layout/page-container';

<PageContainer
  title="Dashboard"
  description="Welcome back"
  actions={<Button>Action</Button>}
  breadcrumbs={[
    { title: 'Home', href: '/' },
    { title: 'Dashboard' }
  ]}
>
  {children}
</PageContainer>
```

### ProPageWrapper (For new advanced pages)
Full-featured page wrapper using **PageContainer** from `@rnr/rnr-ui-pro`.

**Additional Features:**
- Tab navigation
- Advanced breadcrumbs
- Loading states
- ScrollView support
- All Pro features

**Usage:**
```tsx
import { ProPageWrapper } from '@/components/layout/pro-page-wrapper';

<ProPageWrapper
  title="Advanced Dashboard"
  subTitle="With tabs and more"
  breadcrumbs={[...]}
  tabList={[
    { key: 'overview', tab: 'Overview' },
    { key: 'details', tab: 'Details' },
  ]}
  tabActiveKey="overview"
  onTabChange={handleTabChange}
>
  {children}
</ProPageWrapper>
```

### ProLayout
Main application layout with sidebar and header.

### Sidebar
Application navigation sidebar with menu items.

### Header
Top header with user menu and notifications.

## DRY Principle

All components now use Pro components from `@rnr/rnr-ui-pro` to avoid duplication:

- ✅ **PageContainer** uses `ProHeader`
- ✅ **ProPageWrapper** uses `PageContainer` from rnr-ui-pro
- ✅ All form pages can use `ProForm`, `ModalForm`, etc.
- ✅ All table pages can use `ProTable`
- ✅ Consistent styling via NativeWind

## NativeWind Support

All components are designed to work with NativeWind:

1. **Type Declarations**: `global.d.ts` adds `className` support to React Native components
2. **Next.js Config**: Transpiles all necessary packages including `@rnr/rnr-ui-pro`
3. **Webpack Plugin**: Defines `__DEV__` for React Native compatibility

## Migration Guide

### From old PageContainer to new PageContainer
No changes needed! The new component maintains the same API while using Pro components internally.

### To upgrade to ProPageWrapper
```tsx
// Before (old PageContainer)
<PageContainer title="Page" description="Desc">
  {children}
</PageContainer>

// After (ProPageWrapper with tabs)
<ProPageWrapper 
  title="Page" 
  subTitle="Desc"
  tabList={[{ key: 'tab1', tab: 'Tab 1' }]}
>
  {children}
</ProPageWrapper>
```

## Best Practices

1. **Use PageContainer** for simple pages (most cases)
2. **Use ProPageWrapper** when you need tabs or advanced features
3. **Use Pro components** directly in page content (ProTable, ProForm, ProCard, etc.)
4. **Keep layouts consistent** - all pages should use one of these wrappers

## Examples

See these pages for examples:
- `/app/(admin)/dashboard/page.tsx` - Simple PageContainer
- `/app/(admin)/pro-components/page.tsx` - ProPageWrapper with tabs
- `/app/(admin)/tables/users-pro/page.tsx` - ProTable example
- `/app/(admin)/forms/pro-form/page.tsx` - ProForm example

