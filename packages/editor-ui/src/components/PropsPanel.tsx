import { useCallback } from 'react';
import { useEditorStore } from '@/store';
import { catalog, type ComponentType } from '@next-dev/catalog';
import { Box, MousePointer } from 'lucide-react';
import { z } from 'zod';

export function PropsPanel() {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const spec = useEditorStore((s) => s.previewSpec ?? s.spec);
  const hasAiPreview = useEditorStore((s) => Boolean(s.pendingAiProposal));
  const setProps = useEditorStore((s) => s.setProps);

  if (selectedIds.length === 0) {
    return (
      <div className="empty-state">
        {hasAiPreview ? (
          <Box className="empty-state-icon" />
        ) : (
          <MousePointer className="empty-state-icon" />
        )}
        <p className="empty-state-text">
          {hasAiPreview
            ? 'AI preview is active. Select an element in the frozen preview to inspect its properties.'
            : 'Select an element to edit its properties'}
        </p>
      </div>
    );
  }

  if (selectedIds.length > 1) {
    return (
      <div className="empty-state">
        <Box className="empty-state-icon" />
        <p className="empty-state-text">
          {selectedIds.length} elements selected
        </p>
      </div>
    );
  }

  const elementId = selectedIds[0];
  const element = spec.elements[elementId];

  if (!element) {
    return (
      <div className="empty-state">
        <Box className="empty-state-icon" />
        <p className="empty-state-text">
          {hasAiPreview
            ? 'The selected element is removed in this AI preview.'
            : 'The selected element is no longer available.'}
        </p>
      </div>
    );
  }

  const catalogEntry = catalog[element.type as ComponentType];
  const schema = catalogEntry?.schema;

  return (
    <div className="props-panel animate-fade-in">
      {hasAiPreview && (
        <div className="panel-readonly-note">
          Preview mode is active. Review the draft here, then accept or reject it in chat before editing.
        </div>
      )}

      <div className="props-section">
        <div className="props-section-title">Element</div>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
          {element.__editor?.name ?? element.type}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Type: {element.type} | ID: {elementId.slice(0, 8)}...
        </div>
      </div>

      {schema ? (
        <div className="props-section">
          <div className="props-section-title">Properties</div>
          <SchemaForm
            schema={schema}
            values={element.props}
            disabled={hasAiPreview}
            onChange={(key, value) => {
              setProps(elementId, { [key]: value });
            }}
          />
        </div>
      ) : (
        <div className="props-section">
          <div className="props-section-title">Properties</div>
          {Object.entries(element.props).map(([key, value]) => (
            <div key={key} className="props-field">
              <label className="props-label">{key}</label>
              <input
                className="props-input"
                value={String(value ?? '')}
                onChange={(event) => setProps(elementId, { [key]: event.target.value })}
                disabled={hasAiPreview}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SchemaForm({
  schema,
  values,
  disabled,
  onChange,
}: {
  schema: z.ZodObject<z.ZodRawShape>;
  values: Record<string, unknown>;
  disabled: boolean;
  onChange: (key: string, value: unknown) => void;
}) {
  const shape = schema.shape;

  return (
    <>
      {Object.entries(shape).map(([key, field]) => (
        <SchemaField
          key={key}
          fieldKey={key}
          field={field as z.ZodType}
          value={values[key]}
          disabled={disabled}
          onChange={onChange}
        />
      ))}
    </>
  );
}

function SchemaField({
  fieldKey,
  field,
  value,
  disabled,
  onChange,
}: {
  fieldKey: string;
  field: z.ZodType;
  value: unknown;
  disabled: boolean;
  onChange: (key: string, value: unknown) => void;
}) {
  const handleChange = useCallback(
    (newValue: unknown) => {
      onChange(fieldKey, newValue);
    },
    [fieldKey, onChange],
  );

  let innerField = field;
  while (innerField instanceof z.ZodDefault || innerField instanceof z.ZodNullable) {
    innerField = innerField.unwrap() as z.ZodType;
  }

  if (innerField instanceof z.ZodEnum) {
    const options = innerField.options as string[];

    return (
      <div className="props-field">
        <label className="props-label">{fieldKey}</label>
        <select
          className="props-select"
          value={String(value ?? '')}
          onChange={(event) => handleChange(event.target.value)}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (innerField instanceof z.ZodBoolean) {
    return (
      <div className="props-field">
        <div className="props-checkbox-row">
          <input
            type="checkbox"
            className="props-checkbox"
            checked={Boolean(value)}
            onChange={(event) => handleChange(event.target.checked)}
            disabled={disabled}
          />
          <label className="props-label">{fieldKey}</label>
        </div>
      </div>
    );
  }

  if (innerField instanceof z.ZodNumber) {
    return (
      <div className="props-field">
        <label className="props-label">{fieldKey}</label>
        <input
          type="number"
          className="props-input"
          value={Number(value ?? 0)}
          onChange={(event) => handleChange(Number(event.target.value))}
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className="props-field">
      <label className="props-label">{fieldKey}</label>
      <input
        className="props-input"
        value={String(value ?? '')}
        onChange={(event) => handleChange(event.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
