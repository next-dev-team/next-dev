'use client';

import { ReactNode, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ title: string; href?: string }>;
  showBack?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  title,
  description,
  breadcrumbs,
  showBack = false,
  actions,
  className,
}: PageContainerProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useAppStore();

  useEffect(() => {
    if (breadcrumbs) {
      setBreadcrumbs(breadcrumbs);
    }
  }, [breadcrumbs, setBreadcrumbs]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Header */}
      {(title || description || showBack || actions) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {showBack && (
              <button
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background hover:bg-accent transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="space-y-1">
              {title && (
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              )}
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}

