'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Table2,
  FileText,
  Settings,
  Users,
  BarChart3,
  ShoppingCart,
  Package,
  FolderKanban,
  Menu,
  ChevronLeft,
  Sparkles,
  LogIn,
} from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: 'Tables',
    href: '/tables',
    icon: <Table2 className="h-5 w-5" />,
    children: [
      {
        title: 'Users',
        href: '/tables/users',
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: 'Users Pro',
        href: '/tables/users-pro',
        icon: <Users className="h-4 w-4" />,
        badge: 'New',
      },
      {
        title: 'Products',
        href: '/tables/products',
        icon: <Package className="h-4 w-4" />,
      },
      {
        title: 'Orders',
        href: '/tables/orders',
        icon: <ShoppingCart className="h-4 w-4" />,
        badge: '12',
      },
    ],
  },
  {
    title: 'Forms',
    href: '/forms',
    icon: <FileText className="h-5 w-5" />,
    children: [
      {
        title: 'Basic Form',
        href: '/forms/basic',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: 'Advanced Form',
        href: '/forms/advanced',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        title: 'ProForm',
        href: '/forms/pro-form',
        icon: <FileText className="h-4 w-4" />,
        badge: 'New',
      },
    ],
  },
  {
    title: 'Pro Components',
    href: '/pro-components',
    icon: <Sparkles className="h-5 w-5" />,
    badge: 'New',
  },
  {
    title: 'Auth Pages',
    href: '/auth',
    icon: <LogIn className="h-5 w-5" />,
    children: [
      {
        title: 'Login Pro',
        href: '/login-pro',
        icon: <LogIn className="h-4 w-4" />,
        badge: 'New',
      },
      {
        title: 'Login',
        href: '/login',
        icon: <LogIn className="h-4 w-4" />,
      },
      {
        title: 'Register',
        href: '/register',
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: <FolderKanban className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'bg-card fixed left-0 top-0 z-40 h-screen border-r transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!sidebarCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-lg font-bold">R</span>
            </div>
            <span className="text-lg font-semibold">RNR Admin</span>
          </Link>
        )}
        {sidebarCollapsed && (
          <Link href="/dashboard" className="flex w-full items-center justify-center">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-lg font-bold">R</span>
            </div>
          </Link>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="bg-background hover:bg-accent absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border shadow-md"
      >
        {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                sidebarCollapsed && 'justify-center',
              )}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>

            {/* Sub-menu items */}
            {!sidebarCollapsed && item.children && isActive(item.href) && (
              <div className="ml-4 mt-1 space-y-1 border-l pl-4">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-colors',
                      pathname === child.href
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
                    )}
                  >
                    {child.icon}
                    <span className="flex-1">{child.title}</span>
                    {child.badge && (
                      <span className="bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs">
                        {child.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="absolute bottom-0 w-full border-t p-4">
          <div className="text-muted-foreground text-xs">
            <p className="font-semibold">RNR Admin v1.0.0</p>
            <p className="mt-1">© 2025 All rights reserved</p>
          </div>
        </div>
      )}
    </aside>
  );
}
