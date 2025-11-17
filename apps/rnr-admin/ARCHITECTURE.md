# Architecture - DRY with Pro Components

## 🏗️ Component Hierarchy

```
rnr-admin (Next.js App)
│
├── Components Layer (@/components/layout)
│   ├── PageContainer ──────────> Uses ProHeader from rnr-ui-pro
│   ├── ProPageWrapper ─────────> Uses PageContainer from rnr-ui-pro
│   ├── ProLayout
│   ├── Sidebar
│   └── Header
│
└── Re-exports (@/components/layout)
    ├── ProForm ────────────────> from @rnr/rnr-ui-pro (universal)
    ├── ProTable ───────────────> from @rnr/rnr-ui-pro (universal)
    ├── ProCard ────────────────> from @rnr/rnr-ui-pro (universal)
    ├── ModalForm ──────────────> from @rnr/rnr-ui-pro (universal)
    ├── LoginForm ──────────────> from @rnr/rnr-ui-pro (universal)
    └── ... (all 11 Pro components - all universal!)
```

## 📦 Package Dependencies

```
@rnr-admin
    │
    ├─> @rnr/rnr-ui-pro (Pro Components)
    │       │
    │       ├─> @rnr/rnr-ui (Forms)
    │       │       │
    │       │       └─> rc-field-form
    │       │
    │       └─> @rnr/registry (Base UI)
    │               │
    │               ├─> @rn-primitives/*
    │               └─> lucide-react-native
    │
    ├─> react-native
    ├─> react-native-web
    └─> nativewind
```

## 🔄 Data Flow

### Simple Page Flow

```
Page Component
    │
    └─> PageContainer (@/components/layout)
            │
            ├─> ProHeader (@rnr/rnr-ui-pro)
            │       │
            │       └─> Text, View (react-native)
            │               │
            │               └─> className (NativeWind)
            │
            └─> children (page content)
```

### Advanced Page Flow

```
Page Component
    │
    └─> ProPageWrapper (@/components/layout)
            │
            └─> PageContainer (@rnr/rnr-ui-pro)
                    │
                    ├─> Breadcrumbs
                    ├─> Tabs
                    ├─> Header
                    └─> children (page content)
```

### Form Page Flow

```
Page Component
    │
    ├─> PageContainer
    │
    └─> ProForm (@rnr/rnr-ui-pro)
            │
            ├─> Form (@rnr/rnr-ui)
            │       │
            │       └─> rc-field-form
            │
            └─> Form Fields (Input, Button, etc from @rnr/registry)
```

## 🎨 Styling Flow (Universal Components)

```
Component with className
    │
    ├─> NativeWind (processes className)
    │
    ├─> Tailwind CSS (generates styles)
    │
    └─> React Native StyleSheet (universal!)
            │
            ├─> Web: react-native-web converts to CSS
            └─> Native: React Native styles

All @rnr packages provide universal components!
No adapters or wrappers needed!
```

## 🔧 Build Configuration

### Next.js Config Flow

```javascript
next.config.mjs
    │
    ├─> transpilePackages
    │       ├─> react-native
    │       ├─> react-native-web
    │       ├─> @rnr/registry
    │       ├─> @rnr/rnr-ui
    │       └─> @rnr/rnr-ui-pro ✨
    │
    ├─> webpack
    │       ├─> alias: react-native -> react-native-web
    │       ├─> extensions: .web.js, .web.tsx
    │       └─> DefinePlugin: __DEV__ ✨
    │
    └─> Tailwind CSS
            └─> content: include rnr-ui-pro paths ✨
```

### Type Declaration Flow

```typescript
global.d.ts
    │
    └─> declare module 'react-native'
            │
            ├─> ViewProps { className?: string }
            ├─> TextProps { className?: string }
            └─> PressableProps { className?: string }
                    │
                    └─> Enables NativeWind in TypeScript ✨
```

## 📊 Import Strategy (DRY)

### ❌ Old Way (Duplication)

```typescript
// Multiple import sources
import { PageContainer } from '@/components/layout/page-container';
import { ProForm } from '@rnr/rnr-ui-pro';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';
```

### ✅ New Way (Centralized)

```typescript
// Single import source
import { PageContainer, ProForm, Button, Input } from '@/components/layout';
```

## 🎯 Component Selection Tree

```
Need a page?
    │
    ├─ Simple page?
    │   └─> Use PageContainer
    │
    ├─ Page with tabs?
    │   └─> Use ProPageWrapper
    │
    ├─ Form?
    │   ├─ Simple form? ──> Use ProForm
    │   ├─ In modal? ────> Use ModalForm
    │   ├─ Search? ──────> Use QueryForm
    │   └─ Login? ───────> Use LoginForm
    │
    ├─ Table?
    │   └─> Use ProTable
    │
    ├─ Card?
    │   └─> Use ProCard
    │
    ├─ List?
    │   └─> Use ProList
    │
    └─ Data display?
        └─> Use ProDescriptions
```

## 🚀 Performance Optimization

```
User Request
    │
    ├─> Next.js Server
    │       │
    │       ├─> Server Components (fast)
    │       │
    │       └─> Client Components ('use client')
    │
    ├─> React Native Web
    │       │
    │       └─> Converts RN components to HTML
    │
    ├─> NativeWind
    │       │
    │       └─> Generates optimized CSS
    │
    └─> Browser
            │
            └─> Fast, optimized page
```

## 🔐 Type Safety Flow

```
TypeScript Source
    │
    ├─> global.d.ts (augments React Native types)
    │
    ├─> Component Props (fully typed)
    │
    ├─> Type Checking (tsc)
    │
    └─> Compiled JavaScript
            │
            └─> Runtime with full IntelliSense ✨
```

## 📱 Universal Platform Support

```
Code (TypeScript + React Native + NativeWind)
    │
    ├─> Web Build (Next.js)
    │       │
    │       ├─> react-native-web
    │       ├─> Tailwind CSS
    │       └─> HTML + CSS
    │
    ├─> iOS Build (Expo/React Native)
    │       │
    │       ├─> React Native
    │       ├─> NativeWind
    │       └─> Native iOS
    │
    └─> Android Build (Expo/React Native)
            │
            ├─> React Native
            ├─> NativeWind
            └─> Native Android
```

## 🎨 Theming Flow

```
Tailwind Config
    │
    ├─> CSS Variables (--primary, --background, etc)
    │
    ├─> NativeWind Preset
    │
    ├─> Component Classes (className="bg-primary")
    │
    └─> Rendered Styles
            │
            ├─> Light Mode
            └─> Dark Mode (className="dark")
```

## ✨ Key Architectural Decisions

1. **Single Source of Truth**: All Pro components come from `@rnr/rnr-ui-pro`
2. **Centralized Exports**: `@/components/layout` re-exports everything
3. **Type Augmentation**: `global.d.ts` adds className to React Native types
4. **Universal Support**: Same code works on Web, iOS, Android
5. **NativeWind First**: All styling via className (Tailwind)
6. **DRY Principle**: Zero duplication, maximum reusability

## 📈 Scalability

```
Adding New Pages
    │
    ├─> Use existing Pro components ✅
    │
    ├─> No custom implementation needed ✅
    │
    ├─> Consistent UX automatically ✅
    │
    └─> Less code to maintain ✅
```

## 🎉 Result

A clean, maintainable architecture that:

- ✅ Follows DRY principles
- ✅ Supports universal platforms
- ✅ Uses professional components
- ✅ Maintains type safety
- ✅ Enables fast development
- ✅ Provides consistent UX

**Architecture optimized for scalability and maintainability!** 🚀
