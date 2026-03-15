import { cva } from 'class-variance-authority';
import { Platform } from 'react-native';
import { Button, type ButtonProps } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

const redButtonVariants = cva('', {
  variants: {
    variant: {
      default: cn(
        'bg-red-500 active:bg-red-500/90',
        Platform.select({
          web: 'hover:bg-red-500/90',
        })
      ),
      destructive: cn(
        'bg-red-700 active:bg-red-700/90',
        Platform.select({
          web: 'hover:bg-red-700/90',
        })
      ),
      outline: 'border-red-400 dark:border-red-400',
      secondary: cn(
        'bg-red-200 active:bg-red-200/80',
        Platform.select({
          web: 'hover:bg-red-200/80',
        })
      ),
      ghost: 'active:bg-red-500/10 dark:active:bg-red-500/10',
      link: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const redButtonTextVariants = cva('', {
  variants: {
    variant: {
      default: '',
      destructive: '',
      outline: cn(
        'group-active:text-red-400',
        Platform.select({ web: 'group-hover:text-red-400' })
      ),
      secondary: 'text-black',
      ghost: '',
      link: 'text-red-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type RedButtonProps = ButtonProps & {
  label: string;
};

function RedButton({ label, className, ...props }: RedButtonProps) {
  return (
    <Button className={cn(redButtonVariants({ variant: props.variant }), className)} {...props}>
      <Text className={redButtonTextVariants({ variant: props.variant })}>{label}</Text>
    </Button>
  );
}

export { RedButton, redButtonVariants, redButtonTextVariants };
export type { RedButtonProps };
