'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer as ProPageContainer } from '@rnr/rnr-ui-pro';
import { Button } from '@/registry/new-york/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProPageWrapperProps {
  children: ReactNode;
  title?: string;
  subTitle?: string;
  extra?: ReactNode;
  breadcrumbs?: Array<{ title: string; href?: string }>;
  showBack?: boolean;
  tags?: ReactNode;
  avatar?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  className?: string;
  tabList?: Array<{
    key: string;
    tab: ReactNode;
  }>;
  tabActiveKey?: string;
  onTabChange?: (key: string) => void;
}

/**
 * ProPageWrapper - Full-featured page container using rnr-ui-pro PageContainer
 * Use this for new pages that want the complete Pro experience with tabs, breadcrumbs, etc.
 */
export function ProPageWrapper({
  children,
  title,
  subTitle,
  extra,
  breadcrumbs,
  showBack = false,
  tags,
  avatar,
  footer,
  loading,
  className,
  tabList,
  tabActiveKey,
  onTabChange,
}: ProPageWrapperProps) {
  const router = useRouter();

  // Convert breadcrumbs to Pro format
  const proBreadcrumb = breadcrumbs
    ? {
        items: breadcrumbs.map((crumb) => ({
          title: crumb.title,
          onPress: crumb.href ? () => router.push(crumb.href!) : undefined,
        })),
      }
    : undefined;

  // Create back button as part of extra actions
  const combinedExtra = (
    <div className="flex items-center gap-2">
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
      {extra}
    </div>
  );

  return (
    <ProPageContainer
      title={title}
      subTitle={subTitle}
      extra={showBack || extra ? combinedExtra : undefined}
      breadcrumb={proBreadcrumb}
      header={
        tags || avatar
          ? {
              tags,
              avatar,
            }
          : undefined
      }
      footer={footer}
      loading={loading}
      className={className}
      ghost
      tabList={tabList}
      tabActiveKey={tabActiveKey}
      onTabChange={onTabChange}
    >
      {children}
    </ProPageContainer>
  );
}

