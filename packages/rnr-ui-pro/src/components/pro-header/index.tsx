import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Separator } from '@rnr/registry/src/new-york/components/ui/separator';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export interface ProHeaderProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  tags?: ReactNode;
  extra?: ReactNode;
  avatar?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  ghost?: boolean;
  className?: string;
  style?: ViewStyle;
}

/**
 * ProHeader - Professional page header component
 * Displays page title, subtitle, tags, and actions
 */
export function ProHeader({
  title,
  subTitle,
  tags,
  extra,
  avatar,
  content,
  footer,
  ghost = false,
  className,
  style,
}: ProHeaderProps) {
  return (
    <View
      className={cn(
        'w-full',
        !ghost && 'bg-card border-b p-6',
        className
      )}
      style={style}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center gap-3">
            {avatar && <View>{avatar}</View>}
            
            <View className="flex-1">
              {title && (
                <Text className="text-3xl font-bold mb-1">{title}</Text>
              )}
              
              {subTitle && (
                <Text className="text-muted-foreground">{subTitle}</Text>
              )}
              
              {tags && (
                <View className="flex-row gap-2 mt-2 flex-wrap">{tags}</View>
              )}
            </View>
          </View>

          {content && (
            <View className="mt-4">
              {content}
            </View>
          )}
        </View>

        {extra && (
          <View className="ml-4">{extra}</View>
        )}
      </View>

      {footer && (
        <>
          <Separator className="my-4" />
          <View>{footer}</View>
        </>
      )}
    </View>
  );
}

