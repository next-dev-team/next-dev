import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import {
  JSONUIProvider,
  Renderer,
  type ComponentRegistry,
  type ComponentRenderProps,
} from '@json-render/react';
import { zustandStateStore } from '@json-render/zustand';
import { toJsonRenderSpec } from '@next-dev/catalog/json-render-interop';
import { Document, type DesignSpec } from '@next-dev/editor-core';
import { createStore, type StoreApi } from 'zustand/vanilla';
import { renderers } from './renderers.js';

export interface PreviewOperation {
  type: 'add' | 'remove' | 'move' | 'updateProps';
  parentId?: string;
  elementType?: string;
  props?: Record<string, unknown>;
  elementId?: string;
  newParentId?: string;
  updatedProps?: Record<string, unknown>;
  index?: number;
}

export interface JsonRenderPreviewProps {
  spec: DesignSpec;
  scale?: number;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
}

export interface JsonRenderOperationPreviewProps
  extends Omit<JsonRenderPreviewProps, 'spec'> {
  baseSpec: DesignSpec;
  operations: PreviewOperation[];
}

const PreviewContext = createContext({
  scale: 1,
  interactive: true,
});

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function pruneHiddenElements(spec: DesignSpec): DesignSpec {
  const nextSpec = cloneJson(spec);
  const nextElements: DesignSpec['elements'] = {};

  const visit = (elementId: string): string | null => {
    const element = nextSpec.elements[elementId];
    if (!element || element.__editor?.hidden) {
      return null;
    }

    const children = (element.children ?? [])
      .map((childId) => visit(childId))
      .filter((childId): childId is string => childId !== null);

    nextElements[elementId] = {
      ...element,
      children,
    };

    return elementId;
  };

  const root = visit(nextSpec.root);
  if (!root) {
    return {
      version: 1,
      root: nextSpec.root,
      elements: {},
      state: { ...(nextSpec.state ?? {}) },
    };
  }

  return {
    version: 1,
    root,
    elements: nextElements,
    state: { ...(nextSpec.state ?? {}) },
  };
}

function createPreviewRegistry(): ComponentRegistry {
  const entries = Object.keys(renderers).map((type) => {
    const WrappedRenderer = ({
      element,
      children,
    }: ComponentRenderProps<Record<string, unknown>>) => {
      const preview = useContext(PreviewContext);
      return renderers[type](
        element.props ?? {},
        React.Children.toArray(children),
        {
          scale: preview.scale,
          interactive: preview.interactive,
        },
      );
    };

    WrappedRenderer.displayName = `${type}JsonRenderPreview`;
    return [type, WrappedRenderer];
  });

  return Object.fromEntries(entries) as ComponentRegistry;
}

const previewRegistry = createPreviewRegistry();

function PreviewFallback({
  element,
}: ComponentRenderProps<Record<string, unknown>>) {
  const preview = useContext(PreviewContext);
  return (
    <div
      style={{
        padding: `${Math.round(12 * preview.scale)}px`,
        border: '1px dashed var(--color-border-default)',
        borderRadius: `${Math.round(6 * preview.scale)}px`,
        fontSize: `${Math.round(12 * preview.scale)}px`,
        color: 'var(--color-text-muted)',
        textAlign: 'center',
      }}
    >
      {element.type}
    </div>
  );
}

function usePreviewStateStore(spec: DesignSpec) {
  const storeRef = useRef<StoreApi<Record<string, unknown>> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createStore<Record<string, unknown>>(() => ({
      ...(spec.state ?? {}),
    }));
  }

  useEffect(() => {
    storeRef.current?.setState({ ...(spec.state ?? {}) }, true);
  }, [spec.state]);

  return useMemo(
    () =>
      zustandStateStore({
        store: storeRef.current!,
        updater: (nextState, store) => {
          store.setState({ ...nextState }, true);
        },
      }),
    [],
  );
}

export function buildPreviewSpecFromOperations(
  baseSpec: DesignSpec,
  operations: PreviewOperation[],
): DesignSpec {
  const previewDocument = new Document({
    spec: cloneJson(baseSpec),
  });

  for (const operation of operations) {
    switch (operation.type) {
      case 'add':
        if (!operation.elementType) continue;
        previewDocument.add(
          operation.parentId ?? previewDocument.rootId,
          {
            type: operation.elementType,
            props: { ...(operation.props ?? {}) },
            __editor: { name: operation.elementType },
          },
          operation.index,
        );
        break;
      case 'remove':
        if (operation.elementId) {
          previewDocument.remove(operation.elementId);
        }
        break;
      case 'move':
        if (operation.elementId && operation.newParentId) {
          previewDocument.move(
            operation.elementId,
            operation.newParentId,
            operation.index ?? 0,
          );
        }
        break;
      case 'updateProps':
        if (operation.elementId && operation.updatedProps) {
          previewDocument.setProps(operation.elementId, operation.updatedProps);
        }
        break;
    }
  }

  return previewDocument.spec;
}

export function JsonRenderPreview({
  spec,
  scale = 1,
  interactive = true,
  className,
  style,
  loading,
}: JsonRenderPreviewProps): React.ReactNode {
  const renderableSpec = useMemo(() => pruneHiddenElements(spec), [spec]);
  const stateStore = usePreviewStateStore(renderableSpec);
  const jsonRenderSpec = useMemo(
    () => toJsonRenderSpec(renderableSpec),
    [renderableSpec],
  );

  if (!(jsonRenderSpec.root in jsonRenderSpec.elements)) {
    return null;
  }

  return (
    <PreviewContext.Provider value={{ scale, interactive }}>
      <div className={className} style={style}>
        <JSONUIProvider
          registry={previewRegistry}
          store={stateStore}
          handlers={{}}
        >
          <Renderer
            spec={jsonRenderSpec}
            registry={previewRegistry}
            loading={loading}
            fallback={PreviewFallback}
          />
        </JSONUIProvider>
      </div>
    </PreviewContext.Provider>
  );
}

export function JsonRenderOperationPreview({
  baseSpec,
  operations,
  ...props
}: JsonRenderOperationPreviewProps): React.ReactNode {
  const previewSpec = useMemo(
    () => buildPreviewSpecFromOperations(baseSpec, operations),
    [baseSpec, operations],
  );

  return <JsonRenderPreview spec={previewSpec} {...props} />;
}
