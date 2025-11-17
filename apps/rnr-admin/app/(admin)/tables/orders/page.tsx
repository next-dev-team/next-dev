'use client';

import { PageContainer } from '@/components/layout/page-container';
import { useState } from 'react';
import { Search, Plus, Eye, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export default function OrdersTablePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders] = useState<Order[]>([
    { id: '#12345', customer: 'John Doe', amount: 249.99, status: 'delivered', date: '2024-03-15' },
    { id: '#12346', customer: 'Jane Smith', amount: 129.99, status: 'processing', date: '2024-03-16' },
    { id: '#12347', customer: 'Bob Johnson', amount: 349.99, status: 'shipped', date: '2024-03-17' },
    { id: '#12348', customer: 'Alice Brown', amount: 199.99, status: 'pending', date: '2024-03-18' },
    { id: '#12349', customer: 'Charlie Wilson', amount: 89.99, status: 'cancelled', date: '2024-03-19' },
  ]);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'shipped':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    }
  };

  return (
    <PageContainer
      title="Orders"
      description="Manage customer orders and shipments"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tables', href: '/tables' },
        { title: 'Orders' },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <button className="flex items-center space-x-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Order</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
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
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-primary">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(order.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="rounded-lg p-2 hover:bg-accent transition-colors">
                          <Eye className="h-4 w-4" />
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
              Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
              <span className="font-medium">{orders.length}</span> orders
            </p>
            <div className="flex items-center space-x-2">
              <button className="rounded-lg border px-3 py-1 text-sm hover:bg-accent transition-colors">
                Previous
              </button>
              <button className="rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                1
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

