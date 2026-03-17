import { useEditorStore } from '@/store';
import type { DesignSpec } from '@next-dev/editor-core';
import React from 'react';

interface CanvasNodeProps {
  elementId: string;
  spec: DesignSpec;
  isPreviewMode: boolean;
}

function CanvasNode({ elementId, spec, isPreviewMode }: CanvasNodeProps) {
  const element = spec.elements[elementId];
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const select = useEditorStore((s) => s.select);
  const hover = useEditorStore((s) => s.hover);

  if (!element) return null;
  if (element.__editor?.hidden) return null;

  const isSelected = selectedIds.includes(elementId);
  const isHovered = hoveredId === elementId;

  const children = element.children.map((childId) => (
    <CanvasNode
      key={childId}
      elementId={childId}
      spec={spec}
      isPreviewMode={isPreviewMode}
    />
  ));

  const renderElement = () => {
    const props = element.props ?? {};

    switch (element.type) {
      case 'Stack': {
        const direction = (props.direction as string) ?? 'vertical';
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: direction === 'horizontal' ? 'row' : 'column',
              gap: '8px',
              padding: elementId === spec.root ? '16px' : undefined,
              minHeight: elementId === spec.root ? '100%' : undefined,
            }}
          >
            {children.length > 0 ? children : (
              <div style={{
                padding: '24px',
                border: '2px dashed var(--color-border-dim)',
                borderRadius: '8px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}>
                Drop components here
              </div>
            )}
          </div>
        );
      }

      case 'Button': {
        const variant = (props.variant as string) ?? 'default';
        const size = (props.size as string) ?? 'default';
        const text = (props.children as string) ?? 'Button';
        const disabled = (props.disabled as boolean) ?? false;

        const sizeStyles: Record<string, React.CSSProperties> = {
          sm: { padding: '4px 12px', fontSize: '12px' },
          default: { padding: '8px 16px', fontSize: '13px' },
          lg: { padding: '12px 24px', fontSize: '14px' },
          icon: { padding: '8px', width: '36px', height: '36px' },
        };

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
            style={{
              borderRadius: '6px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: disabled ? 0.5 : 1,
              ...sizeStyles[size],
              ...variantStyles[variant],
            }}
            disabled={disabled}
          >
            {text}
          </button>
        );
      }

      case 'Text': {
        const text = (props.children as string) ?? 'Text';
        const variant = (props.variant as string) ?? 'default';

        const variantStyles: Record<string, React.CSSProperties> = {
          default: {},
          h1: { fontSize: '36px', fontWeight: 800, letterSpacing: '-0.025em' },
          h2: { fontSize: '30px', fontWeight: 600, letterSpacing: '-0.02em' },
          h3: { fontSize: '24px', fontWeight: 600 },
          h4: { fontSize: '20px', fontWeight: 600 },
          p: { lineHeight: 1.75 },
          code: { fontFamily: 'monospace', fontSize: '13px', background: 'var(--color-surface)', padding: '2px 6px', borderRadius: '4px' },
          lead: { fontSize: '20px', color: 'var(--color-text-secondary)' },
          large: { fontSize: '18px', fontWeight: 600 },
          small: { fontSize: '12px', fontWeight: 500 },
          muted: { fontSize: '13px', color: 'var(--color-text-muted)' },
        };

        return (
          <span style={{ ...variantStyles[variant] }}>
            {text}
          </span>
        );
      }

      case 'Card':
        return (
          <div style={{
            background: 'var(--color-panel-bg)',
            border: '1px solid var(--color-border-dim)',
            borderRadius: '12px',
            padding: '0',
            boxShadow: '0 1px 3px oklch(0 0 0 / 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            paddingTop: '24px',
            paddingBottom: '24px',
          }}>
            {children.length > 0 ? children : (
              <div style={{ padding: '24px', color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '12px' }}>
                Card - add children
              </div>
            )}
          </div>
        );

      case 'CardHeader':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 24px' }}>
            {children}
          </div>
        );

      case 'CardTitle': {
        const text = (props.children as string) ?? 'Card Title';
        return (
          <div style={{ fontWeight: 600, fontSize: '16px' }}>
            {text}
          </div>
        );
      }

      case 'CardDescription': {
        const text = (props.children as string) ?? 'Description';
        return (
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {text}
          </div>
        );
      }

      case 'CardContent':
        return (
          <div style={{ padding: '0 24px' }}>
            {children}
          </div>
        );

      case 'CardFooter':
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 24px', gap: '8px' }}>
            {children}
          </div>
        );

      case 'Badge': {
        const text = (props.children as string) ?? 'Badge';
        const variant = (props.variant as string) ?? 'default';

        const variantStyles: Record<string, React.CSSProperties> = {
          default: { background: 'var(--color-accent)', color: '#fff' },
          secondary: { background: 'var(--color-surface)', color: 'var(--color-text-primary)' },
          destructive: { background: 'var(--color-error)', color: '#fff' },
          outline: { background: 'transparent', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)' },
        };

        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '999px',
            padding: '2px 10px',
            fontSize: '12px',
            fontWeight: 500,
            ...variantStyles[variant],
          }}>
            {text}
          </span>
        );
      }

      case 'Input': {
        const placeholder = (props.placeholder as string) ?? 'Enter text...';
        const disabled = (props.disabled as boolean) ?? false;
        return (
          <input
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-dim)',
              borderRadius: '6px',
              padding: '8px 12px',
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
      }

      case 'Textarea': {
        const placeholder = (props.placeholder as string) ?? 'Write here...';
        const disabled = (props.disabled as boolean) ?? false;
        const rows = Number(props.numberOfLines ?? 4);
        return (
          <textarea
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-dim)',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              width: '100%',
              minHeight: `${Math.max(rows, 3) * 22}px`,
              outline: 'none',
              resize: 'vertical',
              opacity: disabled ? 0.5 : 1,
            }}
            placeholder={placeholder}
            readOnly
            disabled={disabled}
          />
        );
      }

      case 'Select':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '220px',
            }}
          >
            {children.length > 0 ? children : (
              <div style={{
                padding: '14px',
                border: '1px dashed var(--color-border-default)',
                borderRadius: '8px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}>
                Add a trigger and menu content
              </div>
            )}
          </div>
        );

      case 'SelectTrigger': {
        const size = (props.size as string) ?? 'default';
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              borderRadius: '8px',
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
            <span style={{ color: 'var(--color-text-muted)' }}>▾</span>
          </div>
        );
      }

      case 'SelectValue': {
        const placeholder = (props.placeholder as string) ?? 'Select an option';
        return (
          <span style={{ color: 'var(--color-text-muted)' }}>
            {placeholder}
          </span>
        );
      }

      case 'SelectContent':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              borderRadius: '10px',
              border: '1px solid var(--color-border-dim)',
              background: 'var(--color-panel-bg)',
              padding: '8px',
              minWidth: '180px',
            }}
          >
            {children.length > 0 ? children : (
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Add select items
              </div>
            )}
          </div>
        );

      case 'SelectGroup':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {children.length > 0 ? children : (
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Group
              </div>
            )}
          </div>
        );

      case 'SelectLabel': {
        const text = (props.children as string) ?? 'Options';
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
      }

      case 'SelectItem': {
        const text = (props.label as string) ?? 'Option';
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
            <span style={{ color: 'var(--color-text-muted)' }}>○</span>
          </div>
        );
      }

      case 'SelectSeparator':
        return (
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'var(--color-border-dim)',
              margin: '4px 0',
            }}
          />
        );

      case 'Label': {
        const text = (props.children as string) ?? 'Label';
        return (
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {text}
          </label>
        );
      }

      case 'Checkbox': {
        const checked = (props.checked as boolean) ?? false;
        const disabled = (props.disabled as boolean) ?? false;
        return (
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              border: `1px solid ${checked ? 'var(--color-accent)' : 'var(--color-border-default)'}`,
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
      }

      case 'Switch': {
        const checked = (props.checked as boolean) ?? false;
        const disabled = (props.disabled as boolean) ?? false;
        return (
          <div
            style={{
              width: '34px',
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
      }

      case 'Separator': {
        const orientation = (props.orientation as string) ?? 'horizontal';
        return (
          <div style={{
            background: 'var(--color-border-dim)',
            ...(orientation === 'horizontal'
              ? { height: '1px', width: '100%' }
              : { width: '1px', height: '100%', minHeight: '20px' }),
          }} />
        );
      }

      case 'Tabs':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              width: '100%',
            }}
          >
            {children.length > 0 ? children : (
              <div style={{
                padding: '16px',
                border: '1px dashed var(--color-border-default)',
                borderRadius: '8px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}>
                Add a TabsList and TabsContent
              </div>
            )}
          </div>
        );

      case 'TabsList':
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
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Add tab triggers
              </div>
            )}
          </div>
        );

      case 'TabsTrigger': {
        const text = (props.children as string) ?? 'Tab 1';
        const disabled = (props.disabled as boolean) ?? false;
        const isDefault = ((props.value as string) ?? 'tab-1') === 'tab-1';
        return (
          <button
            style={{
              borderRadius: '8px',
              border: isDefault
                ? '1px solid var(--color-accent)'
                : '1px solid transparent',
              background: isDefault ? 'var(--color-panel-bg)' : 'transparent',
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
      }

      case 'TabsContent':
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
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Tab content
              </div>
            )}
          </div>
        );

      case 'Popover':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '220px',
            }}
          >
            {children.length > 0 ? children : (
              <div style={{
                padding: '14px',
                border: '1px dashed var(--color-border-default)',
                borderRadius: '8px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}>
                Add a trigger and content
              </div>
            )}
          </div>
        );

      case 'PopoverTrigger':
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
        );

      case 'PopoverContent':
        return (
          <div
            style={{
              borderRadius: '12px',
              border: '1px solid var(--color-border-dim)',
              background: 'var(--color-panel-bg)',
              padding: '14px',
              minHeight: '72px',
              boxShadow: '0 8px 24px oklch(0 0 0 / 0.18)',
            }}
          >
            {children.length > 0 ? children : (
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Popover content
              </div>
            )}
          </div>
        );

      case 'Tooltip':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              width: 'fit-content',
            }}
          >
            {children.length > 0 ? children : (
              <div style={{
                padding: '12px',
                border: '1px dashed var(--color-border-default)',
                borderRadius: '8px',
                color: 'var(--color-text-muted)',
                fontSize: '12px',
              }}>
                Add a trigger and tooltip content
              </div>
            )}
          </div>
        );

      case 'TooltipTrigger':
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
        );

      case 'TooltipContent': {
        const text = (props.children as string) ?? 'Helpful hint';
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
      }

      default:
        return (
          <div style={{
            padding: '12px',
            border: '1px dashed var(--color-border-default)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
          }}>
            {element.type}
            {children}
          </div>
        );
    }
  };

  return (
    <div
      className="canvas-element"
      data-selected={isSelected}
      data-hovered={isHovered && !isSelected}
      data-preview={isPreviewMode}
      data-element-id={elementId}
      onClick={(e) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        select(elementId, e.shiftKey);
      }}
      onMouseEnter={(e) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        hover(elementId);
      }}
      onMouseLeave={(e) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        hover(null);
      }}
    >
      {renderElement()}
    </div>
  );
}

export function Canvas() {
  const spec = useEditorStore((s) => s.spec);
  const previewSpec = useEditorStore((s) => s.previewSpec);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const zoom = useEditorStore((s) => s.zoom);
  const activeSpec = previewSpec ?? spec;
  const isPreviewMode = previewSpec !== null;

  return (
    <div
      className="editor-canvas"
      onClick={() => {
        if (!isPreviewMode) {
          clearSelection();
        }
      }}
    >
      <div
        className="canvas-frame"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        {isPreviewMode && (
          <div className="canvas-preview-banner">
            Preview mode: accept or reject the AI draft from Chat
          </div>
        )}
        <CanvasNode
          elementId={activeSpec.root}
          spec={activeSpec}
          isPreviewMode={isPreviewMode}
        />
      </div>
    </div>
  );
}
