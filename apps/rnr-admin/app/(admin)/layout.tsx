import * as React from 'react';
import { ProLayout } from '@/components/layout/pro-layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProLayout>{children}</ProLayout>;
}

