/**
 * @next-dev/json-render — Component Renderers
 *
 * Each renderer is a function: (props, children) => React.ReactNode
 *
 * Props come from the DesignSpec element, children are already-rendered
 * child React nodes. This design makes the renderer tree-recursive:
 *   render(root) → renderer(props, render(child1), render(child2), ...)
 *
 * Renderers are scale-aware via RenderContext: the canvas can render at
 * full size, while the chat preview can render at a smaller scale.
 */

import type React from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RenderContext {
  /** Scale factor for sizes (1 = full canvas, 0.6 = chat preview) */
  scale: number;
  /** Whether this is an interactive canvas or a static preview */
  interactive: boolean;
}

export type ComponentRenderer = (
  props: Record<string, unknown>,
  children: React.ReactNode[],
  ctx: RenderContext,
) => React.ReactNode;

// ─── Scaled helpers ─────────────────────────────────────────────────────────

function s(base: number, ctx: RenderContext): string {
  return `${Math.round(base * ctx.scale)}px`;
}

// ─── Renderers ──────────────────────────────────────────────────────────────

export const renderers: Record<string, ComponentRenderer> = {
  // ── Layout ───────────────────────────────────────────────────────────

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
        {children.length > 0 ? children : (
          <div style={{
            padding: s(24, ctx),
            border: '2px dashed var(--color-border-dim)',
            borderRadius: s(8, ctx),
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: s(12, ctx),
          }}>
            Drop components here
          </div>
        )}
      </div>
    );
  },

  Card: (_props, children, ctx) => (
    <div style={{
      background: 'var(--color-panel-bg)',
      border: '1px solid var(--color-border-dim)',
      borderRadius: s(12, ctx),
      display: 'flex',
      flexDirection: 'column',
      gap: s(24, ctx),
      paddingTop: s(24, ctx),
      paddingBottom: s(24, ctx),
      boxShadow: '0 1px 3px oklch(0 0 0 / 0.1)',
    }}>
      {children.length > 0 ? children : (
        <div style={{
          padding: s(24, ctx),
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          fontSize: s(12, ctx),
        }}>
          Card — add children
        </div>
      )}
    </div>
  ),

  CardHeader: (_props, children, ctx) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: s(6, ctx), padding: `0 ${s(24, ctx)}` }}>
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
    <div style={{ display: 'flex', alignItems: 'center', padding: `0 ${s(24, ctx)}`, gap: s(8, ctx) }}>
      {children}
    </div>
  ),

  // ── Input ────────────────────────────────────────────────────────────

  Button: (props, _children, ctx) => {
    const variant = (props.variant as string) ?? 'default';
    const text = (props.children as string) ?? 'Button';
    const variantStyles: Record<string, React.CSSProperties> = {
      default: { background: 'var(--color-accent)', color: '#fff', border: 'none' },
      destructive: { background: 'var(--color-error)', color: '#fff', border: 'none' },
      outline: { background: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-default)' },
      secondary: { background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: 'none' },
      ghost: { background: 'transparent', color: 'var(--color-text-primary)', border: 'none' },
      link: { background: 'transparent', color: 'var(--color-accent)', border: 'none', textDecoration: 'underline' },
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

  Input: (props, _children, ctx) => (
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

  Checkbox: (_props, _children, ctx) => (
    <div style={{
      width: s(16, ctx),
      height: s(16, ctx),
      border: '2px solid var(--color-accent)',
      borderRadius: s(3, ctx),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} />
  ),

  Switch: (props, _children, ctx) => {
    const checked = !!props.checked;
    return (
      <div style={{
        width: s(36, ctx),
        height: s(20, ctx),
        borderRadius: s(10, ctx),
        background: checked ? 'var(--color-accent)' : 'var(--color-surface)',
        border: '2px solid var(--color-border-dim)',
        position: 'relative',
        transition: 'background 0.15s',
      }}>
        <div style={{
          width: s(12, ctx),
          height: s(12, ctx),
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: s(2, ctx),
          left: checked ? s(18, ctx) : s(2, ctx),
          transition: 'left 0.15s',
        }} />
      </div>
    );
  },

  Textarea: (props, _children, ctx) => (
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

  Select: (_props, children, _ctx) => (
    <div style={{ position: 'relative', width: '100%' }}>{children}</div>
  ),

  SelectTrigger: (_props, children, ctx) => (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border-dim)',
      borderRadius: s(6, ctx),
      padding: `${s(8, ctx)} ${s(12, ctx)}`,
      fontSize: s(13, ctx),
      color: 'var(--color-text-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {children.length > 0 ? children : 'Select...'}
      <span style={{ color: 'var(--color-text-muted)' }}>▸</span>
    </div>
  ),

  SelectValue: (props, _children, ctx) => (
    <span style={{ fontSize: s(13, ctx), color: 'var(--color-text-muted)' }}>
      {(props.placeholder as string) ?? 'Select...'}
    </span>
  ),

  SelectContent: (_props, children, _ctx) => (
    <div style={{ display: 'none' }}>{children}</div>
  ),

  SelectGroup: (_props, children, _ctx) => <>{children}</>,
  SelectLabel: (props, _children, ctx) => (
    <span style={{ fontSize: s(11, ctx), fontWeight: 600, color: 'var(--color-text-muted)' }}>
      {(props.children as string) ?? 'Group'}
    </span>
  ),
  SelectItem: (props, _children, ctx) => (
    <div style={{ padding: `${s(6, ctx)} ${s(12, ctx)}`, fontSize: s(13, ctx) }}>
      {(props.children as string) ?? 'Item'}
    </div>
  ),
  SelectSeparator: (_props, _children, _ctx) => (
    <div style={{ height: '1px', background: 'var(--color-border-dim)', margin: '4px 0' }} />
  ),

  // ── Display ──────────────────────────────────────────────────────────

  Text: (props, _children, ctx) => {
    const text = (props.children as string) ?? 'Text';
    const variant = (props.variant as string) ?? 'default';
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
    return <span style={styles[variant]}>{text}</span>;
  },

  Badge: (props, _children, ctx) => {
    const variant = (props.variant as string) ?? 'default';
    const styles: Record<string, React.CSSProperties> = {
      default: { background: 'var(--color-accent)', color: '#fff' },
      secondary: { background: 'var(--color-surface)', color: 'var(--color-text-primary)' },
      destructive: { background: 'var(--color-error)', color: '#fff' },
      outline: { background: 'transparent', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)' },
    };
    return (
      <span style={{
        display: 'inline-flex',
        borderRadius: '999px',
        padding: `${s(2, ctx)} ${s(10, ctx)}`,
        fontSize: s(12, ctx),
        fontWeight: 500,
        ...styles[variant],
      }}>
        {(props.children as string) ?? 'Badge'}
      </span>
    );
  },

  Separator: (props, _children, ctx) => {
    const horizontal = (props.orientation as string) !== 'vertical';
    return (
      <div style={{
        background: 'var(--color-border-dim)',
        ...(horizontal
          ? { height: '1px', width: '100%' }
          : { width: '1px', minHeight: s(20, ctx) }),
      }} />
    );
  },

  // ── Navigation ───────────────────────────────────────────────────────

  Tabs: (_props, children, ctx) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: s(12, ctx) }}>
      {children}
    </div>
  ),

  TabsList: (_props, children, ctx) => (
    <div style={{
      display: 'flex',
      gap: s(4, ctx),
      background: 'var(--color-surface)',
      padding: s(4, ctx),
      borderRadius: s(8, ctx),
    }}>
      {children}
    </div>
  ),

  TabsTrigger: (props, _children, ctx) => (
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

  TabsContent: (_props, children, ctx) => (
    <div style={{ padding: s(8, ctx) }}>{children}</div>
  ),

  // ── Overlay ──────────────────────────────────────────────────────────

  Dialog: (_props, children, _ctx) => <>{children}</>,
  DialogTrigger: (_props, children, _ctx) => <>{children}</>,
  DialogContent: (_props, children, ctx) => (
    <div style={{
      background: 'var(--color-panel-bg)',
      border: '1px solid var(--color-border-dim)',
      borderRadius: s(12, ctx),
      padding: s(24, ctx),
      boxShadow: '0 8px 32px oklch(0 0 0 / 0.3)',
      display: 'flex',
      flexDirection: 'column',
      gap: s(16, ctx),
    }}>
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

  Popover: (_props, children, _ctx) => <>{children}</>,
  PopoverTrigger: (_props, children, _ctx) => <>{children}</>,
  PopoverContent: (_props, children, ctx) => (
    <div style={{
      background: 'var(--color-panel-bg)',
      border: '1px solid var(--color-border-dim)',
      borderRadius: s(8, ctx),
      padding: s(12, ctx),
      boxShadow: '0 4px 16px oklch(0 0 0 / 0.2)',
    }}>
      {children}
    </div>
  ),

  Tooltip: (_props, children, _ctx) => <>{children}</>,
  TooltipTrigger: (_props, children, _ctx) => <>{children}</>,
  TooltipContent: (props, _children, ctx) => (
    <div style={{
      background: 'oklch(0.20 0.01 260)',
      color: '#fff',
      padding: `${s(4, ctx)} ${s(8, ctx)}`,
      borderRadius: s(4, ctx),
      fontSize: s(11, ctx),
      boxShadow: '0 2px 8px oklch(0 0 0 / 0.3)',
    }}>
      {(props.children as string) ?? 'Tooltip'}
    </div>
  ),
};
