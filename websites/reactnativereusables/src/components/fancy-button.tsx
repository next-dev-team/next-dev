import { cn } from '../lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type React from 'react';
import { useCallback, useRef } from 'react';
import {
  Animated,
  type GestureResponderEvent,
  Platform,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/**
 * FancyButton — a premium UniWind-styled button
 *
 * Features:
 * - Vibrant gradient background (purple → magenta → pink)
 * - Smooth press scale animation
 * - Accessible focus ring
 * - Multiple variants: default, destructive, outline, ghost, gradient
 * - Multiple sizes: sm, default, lg, icon
 */

const buttonVariants = cva(
  cn(
    'flex-row items-center justify-center rounded-xl shadow-sm',
    Platform.select({
      web: 'outline-none transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    }),
  ),
  {
    variants: {
      variant: {
        default: cn('bg-primary active:opacity-90', Platform.select({ web: 'hover:opacity-90' })),
        destructive: cn(
          'bg-destructive active:opacity-90',
          Platform.select({ web: 'hover:opacity-90' }),
        ),
        outline: cn(
          'border-2 border-border bg-transparent active:bg-accent',
          Platform.select({ web: 'hover:bg-accent' }),
        ),
        ghost: cn('bg-transparent active:bg-accent', Platform.select({ web: 'hover:bg-accent' })),
        gradient: cn('overflow-hidden', Platform.select({ web: 'hover:shadow-lg' })),
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-9 px-4 py-2 rounded-lg',
        lg: 'h-14 px-8 py-4 rounded-2xl',
        icon: 'h-12 w-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'gradient',
      size: 'default',
    },
  },
);

const buttonTextVariants = cva(
  cn(
    'text-base font-semibold tracking-wide',
    Platform.select({ web: 'pointer-events-none select-none transition-colors' }),
  ),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-foreground',
        ghost: 'text-foreground',
        gradient: 'text-white',
      },
      size: {
        default: 'text-base',
        sm: 'text-sm',
        lg: 'text-lg',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'gradient',
      size: 'default',
    },
  },
);

type FancyButtonVariantProps = VariantProps<typeof buttonVariants>;

interface FancyButtonProps extends Omit<PressableProps, 'children'>, FancyButtonVariantProps {
  children?: React.ReactNode;
  /** Button label text — use this or children */
  label?: string;
  /** Show shimmer animation on gradient variant */
  shimmer?: boolean;
}

function FancyButton({
  className,
  variant = 'gradient',
  size = 'default',
  label,
  children,
  shimmer = true,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: FancyButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
      onPressIn?.(e);
    },
    [scaleAnim, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 6,
      }).start();
      onPressOut?.(e);
    },
    [scaleAnim, onPressOut],
  );

  const isGradient = variant === 'gradient';

  const buttonContent = (
    <>
      {isGradient && (
        <View style={[StyleSheet.absoluteFill, styles.gradientBackground]}>
          {shimmer && <View style={[StyleSheet.absoluteFill, styles.shimmerOverlay]} />}
        </View>
      )}
      <View style={styles.contentContainer}>
        {children ?? (
          <Text className={cn(buttonTextVariants({ variant, size }))}>{label ?? 'Button'}</Text>
        )}
      </View>
    </>
  );

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, disabled && styles.disabled]}>
      <Pressable
        className={cn(buttonVariants({ variant, size }), className)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        {...props}
      >
        {buttonContent}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    // UniWind CSS-first gradient: uses hsl vars from global.css
    // Fallback to a vibrant purple-to-pink gradient
    backgroundColor: 'hsl(262, 83%, 58%)',
    ...Platform.select({
      web: {
        background:
          'linear-gradient(135deg, hsl(262, 83%, 58%), hsl(292, 84%, 61%), hsl(322, 80%, 60%))',
      },
    }),
    borderRadius: 12,
  },
  shimmerOverlay: {
    ...Platform.select({
      web: {
        background:
          'linear-gradient(110deg, transparent 33%, rgba(255,255,255,0.15) 50%, transparent 67%)',
        backgroundSize: '250% 100%',
        // @ts-ignore — web-only animation
        animation: 'shimmer 2.5s ease-in-out infinite',
      },
    }),
    borderRadius: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});

export { FancyButton, buttonVariants, buttonTextVariants };
export type { FancyButtonProps, FancyButtonVariantProps };
