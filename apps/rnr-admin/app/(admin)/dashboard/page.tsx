'use client';

import * as React from 'react';
import { PageContainer } from '@/components/layout/page-container';
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        </div>
        <div
          className={`flex items-center space-x-1 text-sm font-medium ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Users',
      value: formatNumber(12845),
      change: 12.5,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(458920),
      change: 8.2,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: 'Total Orders',
      value: formatNumber(3456),
      change: -2.4,
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: 4.1,
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', amount: 249.99, status: 'Completed' },
    { id: '#12346', customer: 'Jane Smith', amount: 129.99, status: 'Processing' },
    { id: '#12347', customer: 'Bob Johnson', amount: 349.99, status: 'Shipped' },
    { id: '#12348', customer: 'Alice Brown', amount: 199.99, status: 'Pending' },
  ];

  return (
    <PageContainer
      title="Dashboard"
      description="Welcome back! Here's what's happening with your business today."
      breadcrumbs={[{ title: 'Dashboard' }]}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts and Tables Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Recent Orders</h3>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.amount)}</p>
                    <span
                      className={`text-xs ${
                        order.status === 'Completed'
                          ? 'text-green-600 dark:text-green-400'
                          : order.status === 'Processing'
                            ? 'text-blue-600 dark:text-blue-400'
                            : order.status === 'Shipped'
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Chart Placeholder */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Sales Overview</h3>
            <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Chart visualization coming soon...</p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { user: 'John Doe', action: 'placed a new order', time: '2 minutes ago' },
              { user: 'Admin', action: 'updated product inventory', time: '15 minutes ago' },
              { user: 'Jane Smith', action: 'registered as a new user', time: '1 hour ago' },
              { user: 'System', action: 'generated monthly report', time: '2 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

