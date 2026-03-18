export const SUPPORTED_COMPONENT_CASES: Record<string, string> = {
  Stack: `case 'Stack': {
      const direction = (props.direction as string) ?? 'vertical';
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: direction === 'horizontal' ? 'row' : 'column',
            gap: '8px',
            minHeight: children.length === 0 ? '96px' : undefined,
          }}
        >
          {children.length > 0 ? children : (
            <div
              style={{
                padding: '24px',
                border: '2px dashed var(--color-border-dim)',
                borderRadius: '12px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}
            >
              Drop components here
            </div>
          )}
        </div>
      );
    }`,
  Button: `case 'Button': {
      const variant = (props.variant as string) ?? 'default';
      const size = (props.size as string) ?? 'default';
      const text = (props.children as ReactNode) ?? 'Button';
      const disabled = (props.disabled as boolean) ?? false;

      const sizeStyles: Record<string, CSSProperties> = {
        sm: { padding: '4px 12px', fontSize: '12px' },
        default: { padding: '8px 16px', fontSize: '13px' },
        lg: { padding: '12px 24px', fontSize: '14px' },
        icon: { padding: '8px', width: '36px', height: '36px' },
      };

      const variantStyles: Record<string, CSSProperties> = {
        default: { background: 'var(--color-accent)', color: '#fff', border: 'none' },
        destructive: { background: 'var(--color-error)', color: '#fff', border: 'none' },
        outline: {
          background: 'transparent',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-default)',
        },
        secondary: { background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: 'none' },
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
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.5 : 1,
            ...sizeStyles[size] ?? sizeStyles.default,
            ...variantStyles[variant] ?? variantStyles.default,
          }}
          disabled={disabled}
        >
          {text}
        </button>
      );
    }`,
  Text: `case 'Text': {
      const text = (props.children as ReactNode) ?? 'Text';
      const variant = (props.variant as string) ?? 'default';

      const variantStyles: Record<string, CSSProperties> = {
        default: {},
        h1: { fontSize: '36px', fontWeight: 800, letterSpacing: '-0.025em' },
        h2: { fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em' },
        h3: { fontSize: '24px', fontWeight: 700 },
        h4: { fontSize: '20px', fontWeight: 700 },
        p: { lineHeight: 1.75 },
        code: {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: '13px',
          background: 'var(--color-surface)',
          padding: '2px 6px',
          borderRadius: '6px',
        },
        lead: { fontSize: '20px', color: 'var(--color-text-secondary)' },
        large: { fontSize: '18px', fontWeight: 600 },
        small: { fontSize: '12px', fontWeight: 600 },
        muted: { fontSize: '13px', color: 'var(--color-text-muted)' },
      };

      if (variant === 'h1') return <h1 style={variantStyles.h1}>{text}</h1>;
      if (variant === 'h2') return <h2 style={variantStyles.h2}>{text}</h2>;
      if (variant === 'h3') return <h3 style={variantStyles.h3}>{text}</h3>;
      if (variant === 'h4') return <h4 style={variantStyles.h4}>{text}</h4>;
      if (variant === 'p' || variant === 'lead' || variant === 'large' || variant === 'small' || variant === 'muted') {
        return <p style={variantStyles[variant]}>{text}</p>;
      }
      if (variant === 'code') return <code style={variantStyles.code}>{text}</code>;
      return <span style={variantStyles.default}>{text}</span>;
    }`,
  Card: `case 'Card':
      return (
        <div
          style={{
            background: 'var(--color-panel-bg)',
            border: '1px solid var(--color-border-dim)',
            borderRadius: '18px',
            boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            paddingTop: '24px',
            paddingBottom: '24px',
          }}
        >
          {children.length > 0 ? children : (
            <div
              style={{
                padding: '24px',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              Card - add children
            </div>
          )}
        </div>
      );`,
  CardHeader: `case 'CardHeader':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 24px' }}>
          {children}
        </div>
      );`,
  CardTitle: `case 'CardTitle': {
      const text = (props.children as ReactNode) ?? 'Card Title';
      return <h3 style={{ fontWeight: 700, fontSize: '16px' }}>{text}</h3>;
    }`,
  CardDescription: `case 'CardDescription': {
      const text = (props.children as ReactNode) ?? 'Description';
      return <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{text}</p>;
    }`,
  CardContent: `case 'CardContent':
      return <div style={{ padding: '0 24px' }}>{children}</div>;`,
  CardFooter: `case 'CardFooter':
      return (
        <div
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 24px', gap: '8px' }}
        >
          {children}
        </div>
      );`,
  Badge: `case 'Badge': {
      const text = (props.children as ReactNode) ?? 'Badge';
      const variant = (props.variant as string) ?? 'default';

      const variantStyles: Record<string, CSSProperties> = {
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
            alignItems: 'center',
            borderRadius: '999px',
            padding: '2px 10px',
            fontSize: '12px',
            fontWeight: 600,
            ...variantStyles[variant] ?? variantStyles.default,
          }}
        >
          {text}
        </span>
      );
    }`,
  Input: `case 'Input': {
      const placeholder = (props.placeholder as string) ?? 'Enter text...';
      const disabled = (props.disabled as boolean) ?? false;

      return (
        <input
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-dim)',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '13px',
            color: 'var(--color-text-primary)',
            width: '100%',
            outline: 'none',
            opacity: disabled ? 0.5 : 1,
          }}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
        />
      );
    }`,
  Textarea: `case 'Textarea': {
      const placeholder = (props.placeholder as string) ?? 'Write here...';
      const disabled = (props.disabled as boolean) ?? false;
      const rows = Number(props.numberOfLines ?? 4);

      return (
        <textarea
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-dim)',
            borderRadius: '10px',
            padding: '10px 12px',
            fontSize: '13px',
            color: 'var(--color-text-primary)',
            width: '100%',
            minHeight: String(Math.max(rows, 3) * 22) + 'px',
            outline: 'none',
            resize: 'vertical',
            opacity: disabled ? 0.5 : 1,
          }}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
        />
      );
    }`,
  Select: `case 'Select':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '220px' }}>
          {children.length > 0 ? children : (
            <div
              style={{
                padding: '14px',
                border: '1px dashed var(--color-border-default)',
                borderRadius: '10px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}
            >
              Add a trigger and menu content
            </div>
          )}
        </div>
      );`,
  SelectTrigger: `case 'SelectTrigger': {
      const size = (props.size as string) ?? 'default';

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            borderRadius: '10px',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-surface)',
            padding: size === 'sm' ? '7px 10px' : '9px 12px',
            minWidth: '180px',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            {children.length > 0 ? children : (
              <span style={{ color: 'var(--color-text-muted)' }}>Select an option</span>
            )}
          </div>
          <span style={{ color: 'var(--color-text-muted)' }}>v</span>
        </div>
      );
    }`,
  SelectValue: `case 'SelectValue': {
      const placeholder = (props.placeholder as string) ?? 'Select an option';
      return <span style={{ color: 'var(--color-text-muted)' }}>{placeholder}</span>;
    }`,
  SelectContent: `case 'SelectContent':
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            borderRadius: '12px',
            border: '1px solid var(--color-border-dim)',
            background: 'var(--color-panel-bg)',
            padding: '8px',
            minWidth: '180px',
          }}
        >
          {children.length > 0 ? children : (
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Add select items</div>
          )}
        </div>
      );`,
  SelectGroup: `case 'SelectGroup':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {children.length > 0 ? children : (
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Group</div>
          )}
        </div>
      );`,
  SelectLabel: `case 'SelectLabel': {
      const text = (props.children as ReactNode) ?? 'Options';
      return (
        <div
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '2px 4px 4px',
          }}
        >
          {text}
        </div>
      );
    }`,
  SelectItem: `case 'SelectItem': {
      const text = (props.label as ReactNode) ?? (props.children as ReactNode) ?? 'Option';
      const disabled = (props.disabled as boolean) ?? false;
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            borderRadius: '8px',
            padding: '8px 10px',
            background: 'var(--color-surface)',
            border: '1px solid transparent',
            color: 'var(--color-text-primary)',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <span>{text}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>o</span>
        </div>
      );
    }`,
  SelectSeparator: `case 'SelectSeparator':
      return <div style={{ width: '100%', height: '1px', background: 'var(--color-border-dim)', margin: '4px 0' }} />;`,
  Label: `case 'Label': {
      const text = (props.children as ReactNode) ?? 'Label';
      return <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{text}</label>;
    }`,
  Checkbox: `case 'Checkbox': {
      const checked = (props.checked as boolean) ?? false;
      const disabled = (props.disabled as boolean) ?? false;

      return (
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            border: '1px solid ' + (checked ? 'var(--color-accent)' : 'var(--color-border-default)'),
            background: checked ? 'var(--color-accent)' : 'var(--color-surface)',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {checked ? '✓' : ''}
        </div>
      );
    }`,
  Switch: `case 'Switch': {
      const checked = (props.checked as boolean) ?? false;
      const disabled = (props.disabled as boolean) ?? false;

      return (
        <div
          style={{
            width: '36px',
            height: '20px',
            borderRadius: '999px',
            background: checked ? 'var(--color-accent)' : 'var(--color-border-default)',
            padding: '2px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: checked ? 'flex-end' : 'flex-start',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '999px',
              background: '#fff',
            }}
          />
        </div>
      );
    }`,
  Separator: `case 'Separator': {
      const orientation = (props.orientation as string) ?? 'horizontal';
      return (
        <div
          style={{
            background: 'var(--color-border-dim)',
            ...(orientation === 'horizontal'
              ? { height: '1px', width: '100%' }
              : { width: '1px', height: '100%', minHeight: '20px' }),
          }}
        />
      );
    }`,
  Tabs: `case 'Tabs':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {children.length > 0 ? children : (
            <div
              style={{
                padding: '16px',
                border: '1px dashed var(--color-border-default)',
                borderRadius: '10px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}
            >
              Add a TabsList and TabsContent
            </div>
          )}
        </div>
      );`,
  TabsList: `case 'TabsList':
      return (
        <div
          style={{
            display: 'inline-flex',
            gap: '6px',
            padding: '4px',
            borderRadius: '10px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-dim)',
          }}
        >
          {children.length > 0 ? children : (
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Add tab triggers</div>
          )}
        </div>
      );`,
  TabsTrigger: `case 'TabsTrigger': {
      const text = (props.children as ReactNode) ?? 'Tab 1';
      const disabled = (props.disabled as boolean) ?? false;
      const isActive = (props.active as boolean) ?? ((props.value as string) ?? 'tab-1') === 'tab-1';

      return (
        <button
          type="button"
          style={{
            borderRadius: '8px',
            border: isActive ? '1px solid var(--color-accent)' : '1px solid transparent',
            background: isActive ? 'var(--color-panel-bg)' : 'transparent',
            color: 'var(--color-text-primary)',
            padding: '6px 10px',
            fontSize: '12px',
            fontWeight: 600,
            opacity: disabled ? 0.5 : 1,
          }}
          disabled={disabled}
        >
          {text}
        </button>
      );
    }`,
  TabsContent: `case 'TabsContent':
      return (
        <div
          style={{
            border: '1px solid var(--color-border-dim)',
            borderRadius: '12px',
            background: 'var(--color-panel-bg)',
            padding: '16px',
            minHeight: '72px',
          }}
        >
          {children.length > 0 ? children : (
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Tab content</div>
          )}
        </div>
      );`,
  Dialog: `case 'Dialog':
      return <>{children}</>;`,
  DialogTrigger: `case 'DialogTrigger':
      return <>{children.length > 0 ? children : 'Open dialog'}</>;`,
  DialogContent: `case 'DialogContent':
      return (
        <div
          style={{
            background: 'var(--color-panel-bg)',
            border: '1px solid var(--color-border-dim)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {children}
        </div>
      );`,
  DialogHeader: `case 'DialogHeader':
      return <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{children}</div>;`,
  DialogTitle: `case 'DialogTitle': {
      const text = (props.children as ReactNode) ?? 'Dialog Title';
      return <h3 style={{ fontWeight: 700, fontSize: '18px' }}>{text}</h3>;
    }`,
  DialogDescription: `case 'DialogDescription': {
      const text = (props.children as ReactNode) ?? 'Description';
      return <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{text}</p>;
    }`,
  DialogFooter: `case 'DialogFooter':
      return <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>{children}</div>;`,
  Popover: `case 'Popover':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '220px' }}>
          {children.length > 0 ? children : (
            <div
              style={{
                padding: '14px',
                border: '1px dashed var(--color-border-default)',
                borderRadius: '10px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}
            >
              Add a trigger and content
            </div>
          )}
        </div>
      );`,
  PopoverTrigger: `case 'PopoverTrigger':
      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            minWidth: '120px',
          }}
        >
          {children.length > 0 ? children : 'Open popover'}
        </div>
      );`,
  PopoverContent: `case 'PopoverContent':
      return (
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid var(--color-border-dim)',
            background: 'var(--color-panel-bg)',
            padding: '14px',
            minHeight: '72px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
          }}
        >
          {children.length > 0 ? children : (
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Popover content</div>
          )}
        </div>
      );`,
  Tooltip: `case 'Tooltip':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: 'fit-content' }}>
          {children.length > 0 ? children : (
            <div
              style={{
                padding: '12px',
                border: '1px dashed var(--color-border-default)',
                borderRadius: '10px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}
            >
              Add a trigger and tooltip content
            </div>
          )}
        </div>
      );`,
  TooltipTrigger: `case 'TooltipTrigger':
      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '7px 10px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            minWidth: '120px',
          }}
        >
          {children.length > 0 ? children : 'Hover me'}
        </div>
      );`,
  TooltipContent: `case 'TooltipContent': {
      const text = (props.children as ReactNode) ?? 'Helpful hint';
      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '8px',
            background: 'var(--color-text-primary)',
            color: 'var(--color-editor-bg)',
            padding: '6px 10px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {text}
        </div>
      );
    }`,
};

export function buildAppFile(componentTypes: string[]): string {
  const supportedCases = componentTypes
    .map((componentType) => SUPPORTED_COMPONENT_CASES[componentType])
    .filter((value): value is string => Boolean(value))
    .join('\n\n    ');

  return `import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { designSpec, type ExportedElement } from './design-spec';

function renderElement(elementId: string): ReactNode {
  const element = designSpec.elements[elementId] as ExportedElement | undefined;
  if (!element) return null;

  const props = (element.props ?? {}) as Record<string, unknown>;
  const children = (element.children ?? []).map((childId) => (
    <Fragment key={childId}>{renderElement(childId)}</Fragment>
  ));

  switch (element.type) {
    ${supportedCases}
    
    default:
      return (
        <div
          style={{
            padding: '12px',
            border: '1px dashed var(--color-border-default)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <strong style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {element.type}
          </strong>
          {children.length > 0 ? children : 'Component exported as a placeholder.'}
        </div>
      );
  }
}

export default function App() {
  return (
    <main className="designforge-export-shell">
      <div className="designforge-export-frame">
        <div className="designforge-export-canvas">{renderElement(designSpec.root)}</div>
      </div>
    </main>
  );
}
`;
}

export function buildCssFile(): string {
  return `:root {
  color-scheme: light;
  --color-editor-bg: #f4f7fb;
  --color-panel-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-border-dim: #d8e0ea;
  --color-border-default: #c2ceda;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-accent: #2563eb;
  --color-error: #dc2626;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 35%),
    linear-gradient(180deg, #f8fbff 0%, #eef3f8 100%);
  color: var(--color-text-primary);
  font-family: Inter, 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

.designforge-export-shell {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 24px;
}

.designforge-export-frame {
  width: min(1120px, 100%);
  min-height: 720px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(194, 206, 218, 0.8);
  border-radius: 28px;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.12);
  overflow: hidden;
}

.designforge-export-canvas {
  min-height: 720px;
  padding: 24px;
}

h1,
h2,
h3,
h4,
p {
  margin: 0;
}
`;
}
