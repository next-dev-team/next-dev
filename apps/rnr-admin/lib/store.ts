import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AppState {
  // Sidebar state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (_collapsed: boolean) => void;
  
  // Theme state
  theme: 'light' | 'dark' | 'system';
  setTheme: (_theme: 'light' | 'dark' | 'system') => void;
  
  // User state
  user: User | null;
  setUser: (_user: User | null) => void;
  
  // Breadcrumbs
  breadcrumbs: Array<{ title: string; href?: string }>;
  setBreadcrumbs: (_breadcrumbs: Array<{ title: string; href?: string }>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (_collapsed: boolean) => set({ sidebarCollapsed: _collapsed }),
      
      // Theme
      theme: 'system',
      setTheme: (_theme: 'light' | 'dark' | 'system') => set({ theme: _theme }),
      
      // User
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: undefined,
        role: 'Administrator',
      },
      setUser: (_user: User | null) => set({ user: _user }),
      
      // Breadcrumbs
      breadcrumbs: [],
      setBreadcrumbs: (_breadcrumbs: Array<{ title: string; href?: string }>) => set({ breadcrumbs: _breadcrumbs }),
    }),
    {
      name: 'rnr-admin-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);

