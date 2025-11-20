import React from 'react';
import { View, ActivityIndicator, DimensionValue } from 'react-native';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

export interface ProSkeletonProps {
  loading?: boolean;
  active?: boolean;
  avatar?: boolean | { size?: 'large' | 'small' | 'default'; shape?: 'circle' | 'square' };
  title?: boolean | { width?: number | string };
  paragraph?: boolean | { rows?: number; width?: number | string | (number | string)[] };
  round?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function ProSkeleton({
  loading = true,
  active = true,
  avatar,
  title,
  paragraph,
  round = false,
  children,
  className,
}: ProSkeletonProps) {
  if (!loading && children) {
    return <>{children}</>;
  }

  const renderAvatar = () => {
    if (!avatar) return null;

    const avatarConfig = typeof avatar === 'object' ? avatar : {};
    const size = avatarConfig.size || 'default';
    const shape = avatarConfig.shape || 'circle';

    const sizeMap = {
      large: 'h-16 w-16',
      default: 'h-12 w-12',
      small: 'h-8 w-8',
    };

    return (
      <View
        className={cn(
          'bg-muted',
          sizeMap[size],
          shape === 'circle' ? 'rounded-full' : 'rounded-md',
          active && 'animate-pulse',
        )}
      />
    );
  };

  const renderTitle = () => {
    if (!title) return null;

    const titleConfig = typeof title === 'object' ? title : {};
    const width = titleConfig.width || '60%';

    return (
      <View
        className={cn('bg-muted h-4 rounded', active && 'animate-pulse')}
        style={{ width: typeof width === 'number' ? width : width as DimensionValue }}
      />
    );
  };

  const renderParagraph = () => {
    if (!paragraph) return null;

    const paragraphConfig = typeof paragraph === 'object' ? paragraph : {};
    const rows = paragraphConfig.rows || 3;
    const width = paragraphConfig.width || '100%';

    const widths = Array.isArray(width) ? width : [width];

    return (
      <View className="mt-2 gap-2">
        {Array.from({ length: rows }).map((_, index) => {
          const rowWidth = widths[index] || widths[widths.length - 1] || '100%';
          return (
            <View
              key={index}
              className={cn('bg-muted h-3 rounded', active && 'animate-pulse')}
              style={{ width: typeof rowWidth === 'number' ? rowWidth : rowWidth as DimensionValue }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View className={cn('flex-row gap-4', round && 'rounded-lg', className)}>
      {renderAvatar()}
      <View className="flex-1">
        {renderTitle()}
        {renderParagraph()}
      </View>
    </View>
  );
}

interface SkeletonButtonProps {
  size?: 'large' | 'default' | 'small';
  shape?: 'default' | 'circle' | 'round';
  active?: boolean;
  block?: boolean;
  className?: string;
}

function SkeletonButton({
  size = 'default',
  shape = 'default',
  active = true,
  block = false,
  className,
}: SkeletonButtonProps) {
  const sizeMap = {
    large: 'h-11',
    default: 'h-10',
    small: 'h-8',
  };

  const shapeMap = {
    default: 'rounded-md',
    round: 'rounded-full',
    circle: 'rounded-full',
  };

  return (
    <View
      className={cn(
        'bg-muted',
        sizeMap[size],
        shapeMap[shape],
        block ? 'w-full' : 'w-24',
        active && 'animate-pulse',
        className,
      )}
    />
  );
}

interface SkeletonInputProps {
  size?: 'large' | 'default' | 'small';
  active?: boolean;
  className?: string;
}

function SkeletonInput({ size = 'default', active = true, className }: SkeletonInputProps) {
  const sizeMap = {
    large: 'h-11',
    default: 'h-10',
    small: 'h-8',
  };

  return (
    <View
      className={cn(
        'bg-muted w-full rounded-md',
        sizeMap[size],
        active && 'animate-pulse',
        className,
      )}
    />
  );
}

interface SkeletonImageProps {
  width?: number | string;
  height?: number | string;
  active?: boolean;
  className?: string;
}

function SkeletonImage({
  width = 200,
  height = 200,
  active = true,
  className,
}: SkeletonImageProps) {
  return (
    <View
      className={cn('bg-muted rounded-md', active && 'animate-pulse', className)}
      style={{ width: width as DimensionValue, height: height as DimensionValue }}
    />
  );
}

interface SkeletonAvatarProps {
  size?: 'large' | 'default' | 'small';
  shape?: 'circle' | 'square';
  active?: boolean;
  className?: string;
}

function SkeletonAvatar({
  size = 'default',
  shape = 'circle',
  active = true,
  className,
}: SkeletonAvatarProps) {
  const sizeMap = {
    large: 'h-16 w-16',
    default: 'h-12 w-12',
    small: 'h-8 w-8',
  };

  return (
    <View
      className={cn(
        'bg-muted',
        sizeMap[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-md',
        active && 'animate-pulse',
        className,
      )}
    />
  );
}

interface SkeletonTitleProps {
  width?: number | string;
  active?: boolean;
  className?: string;
}

function SkeletonTitle({ width = '60%', active = true, className }: SkeletonTitleProps) {
  return (
    <View
      className={cn('bg-muted h-4 rounded', active && 'animate-pulse', className)}
      style={{ width: typeof width === 'number' ? width : width as DimensionValue }}
    />
  );
}

interface SkeletonParagraphProps {
  rows?: number;
  width?: number | string | (number | string)[];
  active?: boolean;
  className?: string;
}

function SkeletonParagraph({
  rows = 3,
  width = '100%',
  active = true,
  className,
}: SkeletonParagraphProps) {
  const widths = Array.isArray(width) ? width : [width];

  return (
    <View className={cn('gap-2', className)}>
      {Array.from({ length: rows }).map((_, index) => {
        const rowWidth = widths[index] || widths[widths.length - 1] || '100%';
        return (
          <View
            key={index}
            className={cn('bg-muted h-3 rounded', active && 'animate-pulse')}
            style={{ width: typeof rowWidth === 'number' ? rowWidth : rowWidth as DimensionValue }}
          />
        );
      })}
    </View>
  );
}

ProSkeleton.Button = SkeletonButton;
ProSkeleton.Input = SkeletonInput;
ProSkeleton.Image = SkeletonImage;
ProSkeleton.Avatar = SkeletonAvatar;
ProSkeleton.Title = SkeletonTitle;
ProSkeleton.Paragraph = SkeletonParagraph;

export {
  ProSkeleton,
  SkeletonButton,
  SkeletonInput,
  SkeletonImage,
  SkeletonAvatar,
  SkeletonTitle,
  SkeletonParagraph,
};
export type {
  SkeletonButtonProps,
  SkeletonInputProps,
  SkeletonImageProps,
  SkeletonAvatarProps,
  SkeletonTitleProps,
  SkeletonParagraphProps,
};