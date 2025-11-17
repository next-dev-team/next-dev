# RNR Admin

A modern, full-featured admin dashboard starter template inspired by Ant Design Pro. Built with Next.js 15, React 19, and using components from @rnr/registry and @rnr/rnr-ui.

## Features

- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 📊 **Dashboard**: Analytics dashboard with charts and statistics
- 📋 **Data Tables**: Sortable, filterable data tables with CRUD operations
- 📝 **Forms**: Comprehensive form examples using @rnr/rnr-ui
- 🔐 **Authentication**: Login and registration pages (ready for integration)
- 👤 **User Profile**: Profile and settings pages
- 🎯 **Pro Layout**: Inspired by Ant Design Pro's layout system
  - Collapsible sidebar navigation
  - Top header with breadcrumbs and user menu
  - Page containers with consistent spacing
  - Responsive design for mobile and desktop

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: `@rnr/registry` (React Native Reusables - Button, Input, Text, Card, etc.)
- **Forms**: `@rnr/rnr-ui` with rc-field-form
- **Styling**: TailwindCSS with NativeWind
- **Icons**: Lucide React
- **State**: Zustand for global state
- **Charts**: Recharts for data visualization

**Note**: All UI components are imported via path aliases (`@/registry/*` and `@/rnr-ui/*`) configured in `tsconfig.json` - no duplicates in the app!

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3001](http://localhost:3001) to view the admin dashboard.

## Project Structure

```
apps/rnr-admin/
├── app/
│   ├── (admin)/          # Admin layout group
│   │   ├── dashboard/    # Dashboard page
│   │   ├── tables/       # Data table pages
│   │   ├── forms/        # Form examples
│   │   └── settings/     # Settings pages
│   ├── (auth)/          # Auth layout group
│   │   ├── login/       # Login page
│   │   └── register/    # Register page
│   └── layout.tsx       # Root layout
├── components/
│   ├── layout/          # Layout components
│   │   ├── pro-layout.tsx
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── page-container.tsx
│   └── ui/              # Reusable UI components
├── lib/
│   ├── utils.ts         # Utility functions
│   └── store.ts         # Zustand store
└── hooks/               # Custom React hooks
```

## Key Components

### ProLayout
Main layout component that provides the admin interface structure with sidebar and header.

### PageContainer
Wrapper for page content with consistent spacing, breadcrumbs, and optional back button.

### Sidebar
Collapsible navigation sidebar with route highlighting.

### Header
Top bar with breadcrumbs, search, notifications, and user menu.

## Customization

### Theming
Edit `app/globals.css` to customize colors and styles.

### Navigation
Edit `components/layout/sidebar.tsx` to add or remove menu items.

### Pages
Add new pages in the `app/(admin)` directory following the existing structure.

## License

MIT

