import { Icon } from '@/registry/new-york/components/ui/icon';
import { TextClassContext } from '@/registry/new-york/components/ui/text';
import { cn } from '@/registry/new-york/lib/utils';
import * as AccordionPrimitive from '@rn-primitives/accordion';
import { ChevronDown } from 'lucide-react-native';
import { Platform, Pressable, View } from 'react-native';
const Reanimated = Platform.OS !== 'web' ? require('react-native-reanimated') : null;
const AnimatedView = (Reanimated?.default?.View ?? Reanimated?.View ?? View) as any;
const LayoutConfig = (Reanimated?.LayoutAnimationConfig ??
  (({ children }: any) => children)) as any;

function Accordion({
  children,
  ...props
}: Omit<AccordionPrimitive.RootProps, 'asChild'> &
  React.RefAttributes<AccordionPrimitive.RootRef>) {
  return (
    <LayoutConfig skipEntering>
      <AccordionPrimitive.Root
        {...(props as AccordionPrimitive.RootProps)}
        asChild={Platform.OS !== 'web'}
      >
        <AnimatedView layout={Reanimated?.LinearTransition?.duration(200)}>{children}</AnimatedView>
      </AccordionPrimitive.Root>
    </LayoutConfig>
  );
}

function AccordionItem({
  children,
  className,
  value,
  ...props
}: AccordionPrimitive.ItemProps & React.RefAttributes<AccordionPrimitive.ItemRef>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        'border-border border-b',
        Platform.select({ web: 'last:border-b-0' }),
        className,
      )}
      value={value}
      asChild
      {...props}
    >
      <AnimatedView
        className="native:overflow-hidden"
        layout={Platform.select({ native: Reanimated?.LinearTransition?.duration(200) })}
      >
        {children}
      </AnimatedView>
    </AccordionPrimitive.Item>
  );
}

const Trigger = Platform.OS === 'web' ? View : Pressable;

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.TriggerProps & {
  children?: React.ReactNode;
} & React.RefAttributes<AccordionPrimitive.TriggerRef>) {
  const { isExpanded } = AccordionPrimitive.useItemContext();

  const chevronStyle = undefined;

  return (
    <TextClassContext.Provider
      value={cn('text-left text-sm font-medium', Platform.select({ web: 'group-hover:underline' }))}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger {...props} asChild>
          <Trigger
            className={cn(
              'flex-row items-start justify-between gap-4 rounded-md py-4 disabled:opacity-50',
              Platform.select({
                web: 'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 outline-none transition-all hover:underline focus-visible:ring-[3px] disabled:pointer-events-none [&[data-state=open]>svg]:rotate-180',
              }),
              className,
            )}
          >
            <>{children}</>
            <AnimatedView style={chevronStyle}>
              <Icon
                as={ChevronDown}
                size={16}
                className={cn(
                  'text-muted-foreground shrink-0',
                  Platform.select({
                    web: 'pointer-events-none translate-y-0.5 transition-transform duration-200',
                  }),
                )}
              />
            </AnimatedView>
          </Trigger>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.ContentProps & React.RefAttributes<AccordionPrimitive.ContentRef>) {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  return (
    <TextClassContext.Provider value="text-sm">
      <AccordionPrimitive.Content
        className={cn(
          'overflow-hidden',
          Platform.select({
            web: isExpanded ? 'animate-accordion-down' : 'animate-accordion-up',
          }),
        )}
        {...props}
      >
        <AnimatedView
          exiting={Platform.select({ native: Reanimated?.FadeOutUp?.duration(200) })}
          className={cn('pb-4', className)}
        >
          {children}
        </AnimatedView>
      </AccordionPrimitive.Content>
    </TextClassContext.Provider>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
