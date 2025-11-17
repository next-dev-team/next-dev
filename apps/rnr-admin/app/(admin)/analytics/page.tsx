'use client';

import { PageContainer } from '@/components/layout/page-container';
import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <PageContainer
      title="Analytics"
      description="Detailed analytics and insights for your business"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Analytics' },
      ]}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Visitors', value: '24,567', icon: Users, color: 'text-blue-600' },
            { label: 'Page Views', value: '89,234', icon: Activity, color: 'text-green-600' },
            { label: 'Conversions', value: '1,234', icon: TrendingUp, color: 'text-purple-600' },
            { label: 'Cart Items', value: '456', icon: ShoppingCart, color: 'text-orange-600' },
          ].map((metric) => (
            <div key={metric.label} className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className="text-sm text-muted-foreground mt-2">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Chart Placeholders */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Traffic Sources</h3>
            <div className="flex h-80 items-center justify-center rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Chart visualization coming soon...</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">User Demographics</h3>
            <div className="flex h-80 items-center justify-center rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Chart visualization coming soon...</p>
            </div>
          </div>
        </div>

        {/* Full Width Chart */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Performance Over Time</h3>
          <div className="flex h-96 items-center justify-center rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Chart visualization coming soon...</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

