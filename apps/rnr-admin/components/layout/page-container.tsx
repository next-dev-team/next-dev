'use client';

import { ReactNode, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProHeader } from '@rnr/rnr-ui-pro';
import { Button } from '@/registry/new-york/components/ui/button';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ title: string; href?: string }>;
  showBack?: boolean;
  actions?: ReactNode;
  className?: string;
  tags?: ReactNode;
  avatar?: ReactNode;
  footer?: ReactNode;
}

/**
 * PageContainer - Web-optimized wrapper using ProHeader from rnr-ui-pro
 * Maintains compatibility with existing pages while using Pro components
 */
export function PageContainer({
  children,
  title,
  description,
  breadcrumbs,
  showBack = false,
  actions,
  className,
  tags,
  avatar,
  footer,
}: PageContainerProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useAppStore();

  useEffect(() => {
    if (breadcrumbs) {
      setBreadcrumbs(breadcrumbs);
    }
  }, [breadcrumbs, setBreadcrumbs]);

  // Show header if we have any header content
  const hasHeader = title || description || showBack || actions || tags || avatar;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Header using ProHeader */}
      {hasHeader && (
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="outline"
              size="icon"
              onPress={() => router.back()}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1">
            <ProHeader
              title={title}
              subTitle={description}
              tags={tags}
              avatar={avatar}
              extra={actions}
              footer={footer}
              ghost
            />
          </div>
        </div>
      )}

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}

