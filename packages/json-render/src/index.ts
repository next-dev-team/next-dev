/**
 * @next-dev/json-render
 *
 * The rendering contract between:
 *   - The visual canvas (full size, interactive)
 *   - The chat preview (scaled down, static)
 *   - Future code generation
 *
 * Core API:
 *   <JsonRender spec={designSpec} />                     — full canvas mode
 *   <JsonRender spec={designSpec} scale={0.55} />        — chat preview mode
 *   renderNode(spec, elementId, ctx)                     — imperative API
 *
 * The renderer walks the DesignSpec tree recursively:
 *   root → element type → renderer function(props, rendered children, ctx)
 */

export { renderers, type ComponentRenderer, type RenderContext } from './renderers.js';
export { JsonRender, renderNode, renderOperations, type JsonRenderProps } from './render.js';
export {
  buildPreviewSpecFromOperations,
  JsonRenderOperationPreview,
  JsonRenderPreview,
  type JsonRenderOperationPreviewProps,
  type JsonRenderPreviewProps,
  type PreviewOperation,
} from './preview.js';
