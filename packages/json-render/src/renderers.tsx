/**
 * @next-dev/json-render â€” Component Renderers
 *
 * Each renderer is a function: (props, children) => React.ReactNode
 *
 * Props come from the DesignSpec element, children are already-rendered
 * child React nodes. This design makes the renderer tree-recursive:
 *   render(root) â†’ renderer(props, render(child1), render(child2), ...)
 *
 * Renderers are scale-aware via RenderContext: the canvas can render at
 * full size, while the chat preview can render at a smaller scale.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface RenderContext {
  /** Scale factor for sizes (1 = full canvas, 0.6 = chat preview) */
  scale: number;
  /** Whether this is an interactive canvas or a static preview */
  interactive: boolean;
  /** Optional callback to update element props from the renderer (inline editing) */
  onPropsChange?: (props: Record<string, unknown>) => void;
  /** Whether this element is currently in inline-editing mode */
  isEditing?: boolean;
  /** Callback to enter inline-editing mode */
  onStartEdit?: () => void;
}

export type ComponentRenderer = (
  props: Record<string, unknown>,
  children: React.ReactNode[],
  ctx: RenderContext,
) => React.ReactNode;

// â”€â”€â”€ Scaled helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function s(base: number, ctx: RenderContext): string {
  return `${Math.round(base * ctx.scale)}px`;
}

function isRuntimePreview(ctx: RenderContext): boolean {
  return ctx.interactive && !ctx.onPropsChange && !ctx.onStartEdit;
}

function mergeHandler<T extends (...args: any[]) => void>(existing: T | undefined, next: T): T {
  return ((...args: Parameters<T>) => {
    existing?.(...args);
    next(...args);
  }) as T;
}

function renderTriggerChild(
  child: React.ReactNode,
  nextProps: Record<string, unknown>,
  fallbackLabel: string,
): React.ReactNode {
  if (React.isValidElement(child)) {
    const element = child as React.ReactElement<Record<string, unknown>>;
    const mergedProps: Record<string, unknown> = { ...nextProps };

    for (const [key, value] of Object.entries(nextProps)) {
      const existing = element.props[key];
      if (typeof existing === 'function' && typeof value === 'function') {
        mergedProps[key] = mergeHandler(
          existing as (...args: any[]) => void,
          value as (...args: any[]) => void,
        );
      }
    }

    return React.cloneElement(element, mergedProps);
  }

  return (
    <button type="button" {...(nextProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {child ?? fallbackLabel}
    </button>
  );
}

function RuntimeInputControl({
  props,
  ctx,
}: { props: Record<string, unknown>; ctx: RenderContext }) {
  const [value, setValue] = useState((props.value as string) ?? '');
  const disabled = props.disabled === true;
  const inputType = (props.type as React.HTMLInputTypeAttribute) ?? 'text';

  useEffect(() => {
    setValue((props.value as string) ?? '');
  }, [props.value]);

  return (
    <input
      type={inputType}
      disabled={disabled}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-dim)',
        borderRadius: s(6, ctx),
        padding: `${s(8, ctx)} ${s(12, ctx)}`,
        fontSize: s(13, ctx),
        color: 'var(--color-text-primary)',
        width: '100%',
      }}
      placeholder={(props.placeholder as string) ?? 'Enter text...'}
    />
  );
}

function RuntimeTextareaControl({
  props,
  ctx,
}: { props: Record<string, unknown>; ctx: RenderContext }) {
  const [value, setValue] = useState((props.value as string) ?? '');
  const disabled = props.disabled === true;
  const minRows = Math.max(2, Number(props.numberOfLines ?? 4));

  useEffect(() => {
    setValue((props.value as string) ?? '');
  }, [props.value]);

  return (
    <textarea
      disabled={disabled}
      rows={minRows}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-dim)',
        borderRadius: s(6, ctx),
        padding: `${s(8, ctx)} ${s(12, ctx)}`,
        fontSize: s(13, ctx),
        color: 'var(--color-text-primary)',
        width: '100%',
        minHeight: s(80, ctx),
        resize: 'vertical',
      }}
      placeholder={(props.placeholder as string) ?? 'Enter text...'}
    />
  );
}

function RuntimeCheckboxControl({
  props,
  ctx,
}: { props: Record<string, unknown>; ctx: RenderContext }) {
  const [checked, setChecked] = useState(Boolean(props.checked));
  const disabled = props.disabled === true;

  useEffect(() => {
    setChecked(Boolean(props.checked));
  }, [props.checked]);

  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => setChecked(event.target.checked)}
      style={{
        width: s(16, ctx),
        height: s(16, ctx),
        cursor: disabled ? 'not-allowed' : 'pointer',
        accentColor: 'var(--color-accent)',
      }}
    />
  );
}

function RuntimeSwitchControl({
  props,
  ctx,
}: { props: Record<string, unknown>; ctx: RenderContext }) {
  const [checked, setChecked] = useState(Boolean(props.checked));
  const disabled = props.disabled === true;

  useEffect(() => {
    setChecked(Boolean(props.checked));
  }, [props.checked]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          setChecked((prev) => !prev);
        }
      }}
      style={{
        width: s(36, ctx),
        height: s(20, ctx),
        borderRadius: s(10, ctx),
        background: checked ? 'var(--color-accent)' : 'var(--color-surface)',
        border: '2px solid var(--color-border-dim)',
        position: 'relative',
        transition: 'background 0.15s',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span
        style={{
          width: s(12, ctx),
          height: s(12, ctx),
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: s(2, ctx),
          left: checked ? s(18, ctx) : s(2, ctx),
          transition: 'left 0.15s',
        }}
      />
    </button>
  );
}

interface TabsPreviewContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsPreviewContext = React.createContext<TabsPreviewContextValue | null>(null);

function RuntimeTabsRoot({
  defaultValue,
  children,
  ctx,
}: {
  defaultValue: string;
  children: React.ReactNode;
  ctx: RenderContext;
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <TabsPreviewContext.Provider value={{ value, setValue }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(12, ctx) }}>{children}</div>
    </TabsPreviewContext.Provider>
  );
}

function RuntimeTabsTrigger({
  props,
  ctx,
}: { props: Record<string, unknown>; ctx: RenderContext }) {
  const tabs = React.useContext(TabsPreviewContext);
  const value = (props.value as string) ?? 'tab-1';
  const disabled = props.disabled === true;
  const isActive = tabs?.value === value;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          tabs?.setValue(value);
        }
      }}
      style={{
        padding: `${s(6, ctx)} ${s(12, ctx)}`,
        fontSize: s(12, ctx),
        fontWeight: 500,
        border: 'none',
        borderRadius: s(6, ctx),
        background: isActive ? 'var(--color-panel-bg)' : 'transparent',
        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {(props.children as string) ?? 'Tab'}
    </button>
  );
}

function RuntimeTabsContent({
  props,
  children,
  ctx,
}: {
  props: Record<string, unknown>;
  children: React.ReactNode;
  ctx: RenderContext;
}) {
  const tabs = React.useContext(TabsPreviewContext);
  const value = (props.value as string) ?? 'tab-1';

  if (tabs && tabs.value !== value) {
    return null;
  }

  return <div style={{ padding: s(8, ctx) }}>{children}</div>;
}

interface SelectPreviewContextValue {
  value: string | null;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectPreviewContext = React.createContext<SelectPreviewContextValue | null>(null);

function RuntimeSelectRoot({
  initialValue,
  children,
}: {
  initialValue: string | null;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState<string | null>(initialValue);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <SelectPreviewContext.Provider value={{ value, setValue, open, setOpen }}>
      <div style={{ position: 'relative', width: '100%' }}>{children}</div>
    </SelectPreviewContext.Provider>
  );
}

function RuntimeSelectTrigger({
  children,
  ctx,
}: { children: React.ReactNode; ctx: RenderContext }) {
  const select = React.useContext(SelectPreviewContext);
  const isOpen = select?.open ?? false;

  return (
    <button
      type="button"
      onClick={() => select?.setOpen(!isOpen)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-dim)',
        borderRadius: s(6, ctx),
        padding: `${s(8, ctx)} ${s(12, ctx)}`,
        fontSize: s(13, ctx),
        color: 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        cursor: 'pointer',
      }}
    >
      {children}
      <span
        style={{
          color: 'var(--color-text-muted)',
          transform: isOpen ? 'rotate(90deg)' : undefined,
          transition: 'transform 0.15s',
        }}
      >
        {'>'}
      </span>
    </button>
  );
}

function RuntimeSelectValue({
  props,
  ctx,
}: { props: Record<string, unknown>; ctx: RenderContext }) {
  const select = React.useContext(SelectPreviewContext);
  const hasValue = Boolean(select?.value);

  return (
    <span
      style={{
        fontSize: s(13, ctx),
        color: hasValue ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
      }}
    >
      {select?.value ?? (props.placeholder as string) ?? 'Select...'}
    </span>
  );
}

function RuntimeSelectContent({
  children,
  ctx,
}: {
  children: React.ReactNode;
  ctx: RenderContext;
}) {
  const select = React.useContext(SelectPreviewContext);

  if (!select?.open) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'var(--color-panel-bg)',
        border: '1px solid var(--color-border-dim)',
        borderRadius: s(8, ctx),
        boxShadow: '0 8px 24px oklch(0 0 0 / 0.18)',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function RuntimeSelectItem({ props, ctx }: { props: Record<string, unknown>; ctx: RenderContext }) {
  const select = React.useContext(SelectPreviewContext);
  const value = (props.value as string) ?? 'option-1';
  const label = (props.label as string) ?? (props.children as string) ?? value;
  const disabled = props.disabled === true;
  const isSelected = select?.value === value;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        select?.setValue(value);
        select?.setOpen(false);
      }}
      style={{
        width: '100%',
        textAlign: 'left',
        border: 'none',
        background: isSelected ? 'var(--color-hover-overlay)' : 'transparent',
        color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: `${s(8, ctx)} ${s(12, ctx)}`,
        fontSize: s(13, ctx),
      }}
    >
      {label}
    </button>
  );
}

interface OpenPreviewContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogPreviewContext = React.createContext<OpenPreviewContextValue | null>(null);
const PopoverPreviewContext = React.createContext<OpenPreviewContextValue | null>(null);
const TooltipPreviewContext = React.createContext<OpenPreviewContextValue | null>(null);

function RuntimeOpenRoot({
  defaultOpen,
  children,
  context,
}: {
  defaultOpen: boolean;
  children: React.ReactNode;
  context: React.Context<OpenPreviewContextValue | null>;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return React.createElement(context.Provider, {
    value: { open, setOpen },
    children,
  });
}

function RuntimeDialogTrigger({ children }: { children: React.ReactNode }) {
  const dialog = React.useContext(DialogPreviewContext);
  if (!dialog) return <>{children}</>;

  const triggerChild = Array.isArray(children) && children.length === 1 ? children[0] : children;

  return (
    <>
      {renderTriggerChild(
        triggerChild,
        {
          onClick: () => dialog.setOpen(true),
          'aria-haspopup': 'dialog',
          'aria-expanded': dialog.open,
        },
        'Open dialog',
      )}
    </>
  );
}

function RuntimeDialogContent({
  children,
  ctx,
}: {
  children: React.ReactNode;
  ctx: RenderContext;
}) {
  const dialog = React.useContext(DialogPreviewContext);

  if (!dialog?.open) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'oklch(0 0 0 / 0.42)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: s(24, ctx),
        zIndex: 40,
      }}
      onClick={() => dialog.setOpen(false)}
    >
      <div
        style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-border-dim)',
          borderRadius: s(12, ctx),
          padding: s(24, ctx),
          boxShadow: '0 8px 32px oklch(0 0 0 / 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: s(16, ctx),
          minWidth: s(280, ctx),
          maxWidth: 'min(520px, calc(100vw - 48px))',
          position: 'relative',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={() => dialog.setOpen(false)}
          style={{
            position: 'absolute',
            top: s(12, ctx),
            right: s(12, ctx),
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: s(16, ctx),
            lineHeight: 1,
          }}
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
}

function RuntimePopoverTrigger({ children }: { children: React.ReactNode }) {
  const popover = React.useContext(PopoverPreviewContext);
  if (!popover) return <>{children}</>;

  const triggerChild = Array.isArray(children) && children.length === 1 ? children[0] : children;

  return (
    <>
      {renderTriggerChild(
        triggerChild,
        {
          onClick: () => popover.setOpen(!popover.open),
          'aria-expanded': popover.open,
        },
        'Toggle popover',
      )}
    </>
  );
}

function RuntimePopoverContent({
  children,
  ctx,
}: {
  children: React.ReactNode;
  ctx: RenderContext;
}) {
  const popover = React.useContext(PopoverPreviewContext);

  if (!popover?.open) {
    return null;
  }

  return (
    <div
      style={{
        background: 'var(--color-panel-bg)',
        border: '1px solid var(--color-border-dim)',
        borderRadius: s(8, ctx),
        padding: s(12, ctx),
        boxShadow: '0 4px 16px oklch(0 0 0 / 0.2)',
        marginTop: s(8, ctx),
        width: 'max-content',
        maxWidth: '100%',
      }}
    >
      {children}
    </div>
  );
}

function RuntimeTooltipTrigger({ children }: { children: React.ReactNode }) {
  const tooltip = React.useContext(TooltipPreviewContext);
  if (!tooltip) return <>{children}</>;

  const triggerChild = Array.isArray(children) && children.length === 1 ? children[0] : children;

  return (
    <>
      {renderTriggerChild(
        triggerChild,
        {
          onMouseEnter: () => tooltip.setOpen(true),
          onMouseLeave: () => tooltip.setOpen(false),
          onFocus: () => tooltip.setOpen(true),
          onBlur: () => tooltip.setOpen(false),
        },
        'Tooltip target',
      )}
    </>
  );
}

function RuntimeTooltipContent({
  props,
  ctx,
}: { props: Record<string, unknown>; ctx: RenderContext }) {
  const tooltip = React.useContext(TooltipPreviewContext);

  if (!tooltip?.open) {
    return null;
  }

  return (
    <div
      style={{
        background: 'oklch(0.20 0.01 260)',
        color: '#fff',
        padding: `${s(4, ctx)} ${s(8, ctx)}`,
        borderRadius: s(4, ctx),
        fontSize: s(11, ctx),
        boxShadow: '0 2px 8px oklch(0 0 0 / 0.3)',
        width: 'max-content',
        maxWidth: '100%',
        marginTop: s(6, ctx),
      }}
    >
      {(props.children as string) ?? 'Tooltip'}
    </div>
  );
}

// â”€â”€â”€ Inline Editable Text â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getTextStyle(variant: string, ctx: RenderContext): React.CSSProperties {
  const base = 14;
  const styles: Record<string, React.CSSProperties> = {
    default: { fontSize: s(base, ctx) },
    h1: { fontSize: s(36, ctx), fontWeight: 800 },
    h2: { fontSize: s(30, ctx), fontWeight: 600 },
    h3: { fontSize: s(24, ctx), fontWeight: 600 },
    h4: { fontSize: s(20, ctx), fontWeight: 600 },
    p: { fontSize: s(base, ctx), lineHeight: 1.75 },
    muted: { fontSize: s(13, ctx), color: 'var(--color-text-muted)' },
  };
  return styles[variant] ?? styles.default;
}

function InlineEditableText({
  props,
  ctx,
}: { props: Record<string, unknown>; ctx: RenderContext }) {
  const text = (props.children as string) ?? 'Text';
  const variant = (props.variant as string) ?? 'default';
  const spanRef = useRef<HTMLSpanElement>(null);
  const isEditing = ctx.isEditing ?? false;

  // When entering edit mode, focus the element and select all text
  useEffect(() => {
    if (isEditing && spanRef.current) {
      spanRef.current.focus();
      // Select all text inside
      const range = document.createRange();
      range.selectNodeContents(spanRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const commitEdit = useCallback(() => {
    if (!spanRef.current || !ctx.onPropsChange) return;
    const newText = spanRef.current.textContent ?? '';
    if (newText !== text) {
      ctx.onPropsChange({ children: newText });
    }
  }, [ctx, text]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        commitEdit();
        spanRef.current?.blur();
      }
      if (e.key === 'Escape') {
        // Revert text
        if (spanRef.current) spanRef.current.textContent = text;
        spanRef.current?.blur();
      }
      // Stop propagation so the editor keyboard shortcuts (delete, etc.) don't fire while typing
      e.stopPropagation();
    },
    [commitEdit, text],
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (ctx.interactive && ctx.onStartEdit) {
        ctx.onStartEdit();
      }
    },
    [ctx],
  );

  const style: React.CSSProperties = {
    ...getTextStyle(variant, ctx),
    outline: 'none',
    cursor: isEditing ? 'text' : 'default',
    minWidth: isEditing ? '20px' : undefined,
  };

  if (!ctx.interactive || !ctx.onPropsChange) {
    // Static preview mode â€” no editing
    return <span style={getTextStyle(variant, ctx)}>{text}</span>;
  }

  return (
    <span
      ref={spanRef}
      style={style}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={isEditing ? commitEdit : undefined}
      onKeyDown={isEditing ? handleKeyDown : undefined}
    >
      {text}
    </span>
  );
}

// â”€â”€â”€ Renderers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const renderers: Record<string, ComponentRenderer> = {
  // â”€â”€ Layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  Stack: (props, children, ctx) => {
    const dir = (props.direction as string) ?? 'vertical';
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: dir === 'horizontal' ? 'row' : 'column',
          gap: s(8, ctx),
          padding: s(16, ctx),
          minHeight: children.length === 0 ? s(60, ctx) : undefined,
        }}
      >
        {children.length > 0 ? (
          children
        ) : (
          <div
            style={{
              padding: s(24, ctx),
              border: '2px dashed var(--color-border-dim)',
              borderRadius: s(8, ctx),
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: s(12, ctx),
            }}
          >
            Drop components here
          </div>
        )}
      </div>
    );
  },

  Card: (_props, children, ctx) => (
    <div
      style={{
        background: 'var(--color-panel-bg)',
        border: '1px solid var(--color-border-dim)',
        borderRadius: s(12, ctx),
        display: 'flex',
        flexDirection: 'column',
        gap: s(24, ctx),
        paddingTop: s(24, ctx),
        paddingBottom: s(24, ctx),
        boxShadow: '0 1px 3px oklch(0 0 0 / 0.1)',
      }}
    >
      {children.length > 0 ? (
        children
      ) : (
        <div
          style={{
            padding: s(24, ctx),
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            fontSize: s(12, ctx),
          }}
        >
          Card â€” add children
        </div>
      )}
    </div>
  ),

  CardHeader: (_props, children, ctx) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: s(6, ctx),
        padding: `0 ${s(24, ctx)}`,
      }}
    >
      {children}
    </div>
  ),

  CardTitle: (props, _children, ctx) => (
    <div style={{ fontWeight: 600, fontSize: s(16, ctx) }}>
      {(props.children as string) ?? 'Card Title'}
    </div>
  ),

  CardDescription: (props, _children, ctx) => (
    <div style={{ fontSize: s(13, ctx), color: 'var(--color-text-secondary)' }}>
      {(props.children as string) ?? 'Description'}
    </div>
  ),

  CardContent: (_props, children, ctx) => (
    <div style={{ padding: `0 ${s(24, ctx)}` }}>{children}</div>
  ),

  CardFooter: (_props, children, ctx) => (
    <div
      style={{ display: 'flex', alignItems: 'center', padding: `0 ${s(24, ctx)}`, gap: s(8, ctx) }}
    >
      {children}
    </div>
  ),

  // â”€â”€ Input â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  Button: (props, _children, ctx) => {
    const variant = (props.variant as string) ?? 'default';
    const text = (props.children as string) ?? 'Button';
    const variantStyles: Record<string, React.CSSProperties> = {
      default: { background: 'var(--color-accent)', color: '#fff', border: 'none' },
      destructive: { background: 'var(--color-error)', color: '#fff', border: 'none' },
      outline: {
        background: 'transparent',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border-default)',
      },
      secondary: {
        background: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: 'none',
      },
      ghost: { background: 'transparent', color: 'var(--color-text-primary)', border: 'none' },
      link: {
        background: 'transparent',
        color: 'var(--color-accent)',
        border: 'none',
        textDecoration: 'underline',
      },
    };
    return (
      <button
        type="button"
        style={{
          borderRadius: s(6, ctx),
          fontWeight: 500,
          cursor: ctx.interactive ? 'pointer' : 'default',
          padding: `${s(8, ctx)} ${s(16, ctx)}`,
          fontSize: s(13, ctx),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...variantStyles[variant],
        }}
      >
        {text}
      </button>
    );
  },

  Input: (props, _children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeInputControl props={props} ctx={ctx} />
    ) : (
      <input
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-dim)',
          borderRadius: s(6, ctx),
          padding: `${s(8, ctx)} ${s(12, ctx)}`,
          fontSize: s(13, ctx),
          color: 'var(--color-text-primary)',
          width: '100%',
        }}
        placeholder={(props.placeholder as string) ?? 'Enter text...'}
        readOnly
      />
    ),

  Label: (props, _children, ctx) => (
    <span style={{ fontSize: s(13, ctx), fontWeight: 500 }}>
      {(props.children as string) ?? 'Label'}
    </span>
  ),

  Checkbox: (props, _children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeCheckboxControl props={props} ctx={ctx} />
    ) : (
      <div
        style={{
          width: s(16, ctx),
          height: s(16, ctx),
          border: '2px solid var(--color-accent)',
          borderRadius: s(3, ctx),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    ),

  Switch: (props, _children, ctx) => {
    if (isRuntimePreview(ctx)) {
      return <RuntimeSwitchControl props={props} ctx={ctx} />;
    }

    const checked = !!props.checked;
    return (
      <div
        style={{
          width: s(36, ctx),
          height: s(20, ctx),
          borderRadius: s(10, ctx),
          background: checked ? 'var(--color-accent)' : 'var(--color-surface)',
          border: '2px solid var(--color-border-dim)',
          position: 'relative',
          transition: 'background 0.15s',
        }}
      >
        <div
          style={{
            width: s(12, ctx),
            height: s(12, ctx),
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: s(2, ctx),
            left: checked ? s(18, ctx) : s(2, ctx),
            transition: 'left 0.15s',
          }}
        />
      </div>
    );
  },

  Textarea: (props, _children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeTextareaControl props={props} ctx={ctx} />
    ) : (
      <textarea
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-dim)',
          borderRadius: s(6, ctx),
          padding: `${s(8, ctx)} ${s(12, ctx)}`,
          fontSize: s(13, ctx),
          color: 'var(--color-text-primary)',
          width: '100%',
          minHeight: s(80, ctx),
          resize: 'none',
        }}
        placeholder={(props.placeholder as string) ?? 'Enter text...'}
        readOnly
      />
    ),

  Select: (props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeSelectRoot initialValue={(props.value as string) ?? null}>
        {children}
      </RuntimeSelectRoot>
    ) : (
      <div style={{ position: 'relative', width: '100%' }}>{children}</div>
    ),

  SelectTrigger: (_props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeSelectTrigger ctx={ctx}>
        {children.length > 0 ? children : 'Select...'}
      </RuntimeSelectTrigger>
    ) : (
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-dim)',
          borderRadius: s(6, ctx),
          padding: `${s(8, ctx)} ${s(12, ctx)}`,
          fontSize: s(13, ctx),
          color: 'var(--color-text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {children.length > 0 ? children : 'Select...'}
        <span style={{ color: 'var(--color-text-muted)' }}>{'>'}</span>
      </div>
    ),

  SelectValue: (props, _children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeSelectValue props={props} ctx={ctx} />
    ) : (
      <span style={{ fontSize: s(13, ctx), color: 'var(--color-text-muted)' }}>
        {(props.placeholder as string) ?? 'Select...'}
      </span>
    ),

  SelectContent: (_props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeSelectContent ctx={ctx}>{children}</RuntimeSelectContent>
    ) : (
      <div style={{ display: 'none' }}>{children}</div>
    ),

  SelectGroup: (_props, children, _ctx) => <>{children}</>,
  SelectLabel: (props, _children, ctx) => (
    <span style={{ fontSize: s(11, ctx), fontWeight: 600, color: 'var(--color-text-muted)' }}>
      {(props.children as string) ?? 'Group'}
    </span>
  ),
  SelectItem: (props, _children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeSelectItem props={props} ctx={ctx} />
    ) : (
      <div style={{ padding: `${s(6, ctx)} ${s(12, ctx)}`, fontSize: s(13, ctx) }}>
        {(props.children as string) ?? 'Item'}
      </div>
    ),
  SelectSeparator: (_props, _children, _ctx) => (
    <div style={{ height: '1px', background: 'var(--color-border-dim)', margin: '4px 0' }} />
  ),

  // â”€â”€ Display â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  Text: (props, _children, ctx) => {
    return <InlineEditableText props={props} ctx={ctx} />;
  },

  Badge: (props, _children, ctx) => {
    const variant = (props.variant as string) ?? 'default';
    const styles: Record<string, React.CSSProperties> = {
      default: { background: 'var(--color-accent)', color: '#fff' },
      secondary: { background: 'var(--color-surface)', color: 'var(--color-text-primary)' },
      destructive: { background: 'var(--color-error)', color: '#fff' },
      outline: {
        background: 'transparent',
        border: '1px solid var(--color-border-default)',
        color: 'var(--color-text-primary)',
      },
    };
    return (
      <span
        style={{
          display: 'inline-flex',
          borderRadius: '999px',
          padding: `${s(2, ctx)} ${s(10, ctx)}`,
          fontSize: s(12, ctx),
          fontWeight: 500,
          ...styles[variant],
        }}
      >
        {(props.children as string) ?? 'Badge'}
      </span>
    );
  },

  Separator: (props, _children, ctx) => {
    const horizontal = (props.orientation as string) !== 'vertical';
    return (
      <div
        style={{
          background: 'var(--color-border-dim)',
          ...(horizontal
            ? { height: '1px', width: '100%' }
            : { width: '1px', minHeight: s(20, ctx) }),
        }}
      />
    );
  },

  // â”€â”€ Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  Tabs: (props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeTabsRoot defaultValue={(props.defaultValue as string) ?? 'tab-1'} ctx={ctx}>
        {children}
      </RuntimeTabsRoot>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(12, ctx) }}>{children}</div>
    ),

  TabsList: (_props, children, ctx) => (
    <div
      style={{
        display: 'flex',
        gap: s(4, ctx),
        background: 'var(--color-surface)',
        padding: s(4, ctx),
        borderRadius: s(8, ctx),
      }}
    >
      {children}
    </div>
  ),

  TabsTrigger: (props, _children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeTabsTrigger props={props} ctx={ctx} />
    ) : (
      <button
        type="button"
        style={{
          padding: `${s(6, ctx)} ${s(12, ctx)}`,
          fontSize: s(12, ctx),
          fontWeight: 500,
          border: 'none',
          borderRadius: s(6, ctx),
          background: props.active ? 'var(--color-panel-bg)' : 'transparent',
          color: props.active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          cursor: ctx.interactive ? 'pointer' : 'default',
        }}
      >
        {(props.children as string) ?? 'Tab'}
      </button>
    ),

  TabsContent: (props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeTabsContent props={props} ctx={ctx}>
        {children}
      </RuntimeTabsContent>
    ) : (
      <div style={{ padding: s(8, ctx) }}>{children}</div>
    ),

  // â”€â”€ Overlay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  Dialog: (props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeOpenRoot defaultOpen={Boolean(props.open)} context={DialogPreviewContext}>
        {children}
      </RuntimeOpenRoot>
    ) : (
      <>{children}</>
    ),
  DialogTrigger: (_props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeDialogTrigger>{children}</RuntimeDialogTrigger>
    ) : (
      <>{children}</>
    ),
  DialogContent: (_props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeDialogContent ctx={ctx}>{children}</RuntimeDialogContent>
    ) : (
      <div
        style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-border-dim)',
          borderRadius: s(12, ctx),
          padding: s(24, ctx),
          boxShadow: '0 8px 32px oklch(0 0 0 / 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: s(16, ctx),
        }}
      >
        {children}
      </div>
    ),
  DialogHeader: (_props, children, ctx) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: s(4, ctx) }}>{children}</div>
  ),
  DialogTitle: (props, _children, ctx) => (
    <div style={{ fontWeight: 600, fontSize: s(18, ctx) }}>
      {(props.children as string) ?? 'Dialog Title'}
    </div>
  ),
  DialogDescription: (props, _children, ctx) => (
    <div style={{ fontSize: s(13, ctx), color: 'var(--color-text-secondary)' }}>
      {(props.children as string) ?? 'Description'}
    </div>
  ),
  DialogFooter: (_props, children, ctx) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: s(8, ctx) }}>{children}</div>
  ),

  Popover: (props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeOpenRoot defaultOpen={Boolean(props.open)} context={PopoverPreviewContext}>
        {children}
      </RuntimeOpenRoot>
    ) : (
      <>{children}</>
    ),
  PopoverTrigger: (_props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimePopoverTrigger>{children}</RuntimePopoverTrigger>
    ) : (
      <>{children}</>
    ),
  PopoverContent: (_props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimePopoverContent ctx={ctx}>{children}</RuntimePopoverContent>
    ) : (
      <div
        style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-border-dim)',
          borderRadius: s(8, ctx),
          padding: s(12, ctx),
          boxShadow: '0 4px 16px oklch(0 0 0 / 0.2)',
        }}
      >
        {children}
      </div>
    ),

  Tooltip: (props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeOpenRoot defaultOpen={Boolean(props.open)} context={TooltipPreviewContext}>
        {children}
      </RuntimeOpenRoot>
    ) : (
      <>{children}</>
    ),
  TooltipTrigger: (_props, children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeTooltipTrigger>{children}</RuntimeTooltipTrigger>
    ) : (
      <>{children}</>
    ),
  TooltipContent: (props, _children, ctx) =>
    isRuntimePreview(ctx) ? (
      <RuntimeTooltipContent props={props} ctx={ctx} />
    ) : (
      <div
        style={{
          background: 'oklch(0.20 0.01 260)',
          color: '#fff',
          padding: `${s(4, ctx)} ${s(8, ctx)}`,
          borderRadius: s(4, ctx),
          fontSize: s(11, ctx),
          boxShadow: '0 2px 8px oklch(0 0 0 / 0.3)',
        }}
      >
        {(props.children as string) ?? 'Tooltip'}
      </div>
    ),
};
