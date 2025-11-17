'use client';

import { PageContainer } from '@/components/layout/page-container';
import { useState } from 'react';
import { Search, Plus, Edit, Trash, UserCheck } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function UsersTablePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', createdAt: '2024-01-20' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive', createdAt: '2024-02-01' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'active', createdAt: '2024-02-10' },
    { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'active', createdAt: '2024-02-15' },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer
      title="Users"
      description="Manage your users and their permissions"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tables', href: '/tables' },
        { title: 'Users' },
      ]}
      actions={
        <button className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Editor</option>
              <option>User</option>
            </select>
            <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="rounded-lg p-2 hover:bg-accent transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-accent transition-colors">
                          <UserCheck className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-destructive/10 text-destructive transition-colors">
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
              <span className="font-medium">{users.length}</span> users
            </p>
            <div className="flex items-center space-x-2">
              <button className="rounded-lg border px-3 py-1 text-sm hover:bg-accent transition-colors">
                Previous
              </button>
              <button className="rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                1
              </button>
              <button className="rounded-lg border px-3 py-1 text-sm hover:bg-accent transition-colors">
                2
              </button>
              <button className="rounded-lg border px-3 py-1 text-sm hover:bg-accent transition-colors">
                3
              </button>
              <button className="rounded-lg border px-3 py-1 text-sm hover:bg-accent transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

