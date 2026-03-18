/**
 * CodePreview — Premium embedded IDE code preview.
 *
 * A mini VS Code experience embedded in the right panel, showing the
 * generated React + Vite project from the current design spec.
 *
 * Features:
 *  - File tab bar with language-colored indicators
 *  - Collapsible file tree explorer
 *  - Interactive breadcrumb navigation
 *  - Monaco Editor with custom Material-inspired dark theme
 *  - Rich status bar (language, lines, size, encoding)
 *  - Copy to clipboard with animated feedback
 *  - Word-wrap toggle
 *  - Keyboard shortcuts (Alt+↑↓ to cycle files)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { loader, type Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { generateReactViteProject } from '@next-dev/catalog';
import { useEditorStore } from '@/store';
import {
  Code2,
  Copy,
  Check,
  FileCode,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Braces,
  Paintbrush,
  WrapText,
  FolderTree,
  ChevronUp,
} from 'lucide-react';

// Tell @monaco-editor/react to use the local monaco-editor package
// instead of loading from CDN (which is blocked in Electron).
loader.config({ monaco });

// ─── File Type System ───────────────────────────────────────────────────

interface FileTypeInfo {
  color: string;
  langLabel: string;
  Icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}

const FILE_TYPES: Record<string, FileTypeInfo> = {
  tsx: { color: '#61DAFB', langLabel: 'TypeScript JSX', Icon: FileCode },
  ts: { color: '#3178C6', langLabel: 'TypeScript', Icon: FileCode },
  css: { color: '#A855F7', langLabel: 'CSS', Icon: Paintbrush },
  json: { color: '#EAB308', langLabel: 'JSON', Icon: Braces },
};

function getFileType(ext: string): FileTypeInfo {
  return FILE_TYPES[ext] ?? { color: '#6E7681', langLabel: 'Plain Text', Icon: FileCode };
}

// ─── File Definitions ───────────────────────────────────────────────────

interface PreviewFile {
  label: string;
  path: string;
  language: string;
  ext: string;
}

const PREVIEW_FILES: PreviewFile[] = [
  { label: 'App.tsx', path: 'src/App.tsx', language: 'typescript', ext: 'tsx' },
  { label: 'design-spec.ts', path: 'src/design-spec.ts', language: 'typescript', ext: 'ts' },
  { label: 'index.css', path: 'src/index.css', language: 'css', ext: 'css' },
  { label: 'main.tsx', path: 'src/main.tsx', language: 'typescript', ext: 'tsx' },
  { label: 'package.json', path: 'package.json', language: 'json', ext: 'json' },
  { label: 'vite.config.ts', path: 'vite.config.ts', language: 'typescript', ext: 'ts' },
  { label: 'tsconfig.json', path: 'tsconfig.json', language: 'json', ext: 'json' },
];

// ─── File Tree ──────────────────────────────────────────────────────────

interface TreeNode {
  name: string;
  kind: 'file' | 'folder';
  path?: string;
  ext?: string;
  children?: TreeNode[];
}

function buildFileTree(files: PreviewFile[], projectName: string): TreeNode {
  const root: TreeNode = { name: projectName, kind: 'folder', children: [] };

  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current.children!.push({ name: part, kind: 'file', path: file.path, ext: file.ext });
      } else {
        let folder = current.children!.find((c) => c.name === part && c.kind === 'folder');
        if (!folder) {
          folder = { name: part, kind: 'folder', children: [] };
          current.children!.push(folder);
        }
        current = folder;
      }
    }
  }

  // Sort: folders first, then files, each alphabetically
  const sortNode = (node: TreeNode) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortNode);
    }
  };
  sortNode(root);
  return root;
}

function TreeNodeView({
  node,
  activeFile,
  onSelect,
  depth = 0,
}: {
  node: TreeNode;
  activeFile: string;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);

  if (node.kind === 'folder') {
    return (
      <>
        <button
          type="button"
          className="ide-tree-item ide-tree-folder"
          style={{ paddingLeft: `${8 + depth * 14}px` }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          {expanded ? (
            <FolderOpen size={14} className="ide-tree-folder-icon" />
          ) : (
            <Folder size={14} className="ide-tree-folder-icon" />
          )}
          <span>{node.name}</span>
        </button>
        {expanded &&
          node.children?.map((child) => (
            <TreeNodeView
              key={child.path ?? child.name}
              node={child}
              activeFile={activeFile}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
      </>
    );
  }

  const isActive = node.path === activeFile;
  const ft = getFileType(node.ext ?? '');
  const FileIcon = ft.Icon;

  return (
    <button
      type="button"
      className="ide-tree-item ide-tree-file"
      data-active={isActive}
      style={{ paddingLeft: `${8 + depth * 14}px` }}
      onClick={() => node.path && onSelect(node.path)}
    >
      <span className="ide-tree-spacer" />
      <FileIcon size={13} style={{ color: ft.color, flexShrink: 0 }} />
      <span>{node.name}</span>
    </button>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// ─── Component ──────────────────────────────────────────────────────────

export function CodePreview() {
  const spec = useEditorStore((s) => s.spec);
  const filePath = useEditorStore((s) => s.filePath);

  const [activeFile, setActiveFile] = useState<string>('src/App.tsx');
  const [copied, setCopied] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // ── Generate Code ───────────────────────────────────────────────────
  const project = useMemo(() => {
    try {
      const projectName =
        filePath
          ?.split(/[\\/]/)
          .pop()
          ?.replace(/\.[^.]+$/, '')
          .trim() || 'untitled';
      return generateReactViteProject(spec, { projectName });
    } catch {
      return null;
    }
  }, [spec, filePath]);

  const filesMap = useMemo(() => {
    if (!project) return {};
    const map: Record<string, string> = {};
    for (const f of project.files) {
      map[f.path] = f.content;
    }
    return map;
  }, [project]);

  const projectName = useMemo(() => {
    return (
      filePath
        ?.split(/[\\/]/)
        .pop()
        ?.replace(/\.[^.]+$/, '')
        .trim() || 'untitled'
    );
  }, [filePath]);

  const fileTree = useMemo(() => buildFileTree(PREVIEW_FILES, projectName), [projectName]);

  const activeContent = filesMap[activeFile] ?? '// No content generated';
  const activeFileDef = PREVIEW_FILES.find((f) => f.path === activeFile);
  const activeFileType = getFileType(activeFileDef?.ext ?? '');
  const lineCount = activeContent.split('\n').length;
  const byteSize = new TextEncoder().encode(activeContent).length;
  const breadcrumbs = activeFile.split('/');

  // ── Scroll active tab into view ────────────────────────────────────
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [activeFile]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Alt+↑↓ to cycle files
      if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        // Only if no text input is focused
        const target = e.target as HTMLElement;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target.isContentEditable
        )
          return;

        e.preventDefault();
        const currentIndex = PREVIEW_FILES.findIndex((f) => f.path === activeFile);
        const nextIndex =
          e.key === 'ArrowDown'
            ? (currentIndex + 1) % PREVIEW_FILES.length
            : (currentIndex - 1 + PREVIEW_FILES.length) % PREVIEW_FILES.length;
        setActiveFile(PREVIEW_FILES[nextIndex].path);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeFile]);

  // ── Copy handler ───────────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [activeContent]);

  // ── File tree selection ────────────────────────────────────────────
  const handleTreeSelect = useCallback((path: string) => {
    setActiveFile(path);
    setShowTree(false);
  }, []);

  // ── Monaco theme ───────────────────────────────────────────────────
  const configureMonaco = useCallback((m: Monaco) => {
    m.editor.defineTheme('designforge-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '546E7A', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C792EA' },
        { token: 'keyword.control', foreground: 'C792EA' },
        { token: 'string', foreground: 'C3E88D' },
        { token: 'string.key.json', foreground: '82AAFF' },
        { token: 'string.value.json', foreground: 'C3E88D' },
        { token: 'number', foreground: 'F78C6C' },
        { token: 'type', foreground: 'FFCB6B' },
        { token: 'type.identifier', foreground: 'FFCB6B' },
        { token: 'identifier', foreground: 'BABED8' },
        { token: 'tag', foreground: 'F07178' },
        { token: 'delimiter.html', foreground: '89DDFF' },
        { token: 'delimiter.xml', foreground: '89DDFF' },
        { token: 'delimiter.bracket', foreground: 'BABED8' },
        { token: 'attribute.name', foreground: 'FFCB6B' },
        { token: 'attribute.value', foreground: 'C3E88D' },
        { token: 'metatag.content.html', foreground: 'C3E88D' },
        { token: 'variable', foreground: 'BABED8' },
        { token: 'variable.predefined', foreground: '82AAFF' },
        { token: 'constant', foreground: 'F78C6C' },
        { token: 'annotation', foreground: 'FF5370' },
        { token: 'regexp', foreground: '89DDFF' },
      ],
      colors: {
        'editor.background': '#0B1015',
        'editor.foreground': '#BABED8',
        'editor.lineHighlightBackground': '#0F1920',
        'editor.selectionBackground': '#1F3A5F',
        'editorLineNumber.foreground': '#2A3340',
        'editorLineNumber.activeForeground': '#546E7A',
        'editor.inactiveSelectionBackground': '#14202C',
        'editorWidget.background': '#0F1920',
        'editorWidget.border': '#1E2A36',
        'editorIndentGuide.background': '#17212B',
        'editorIndentGuide.activeBackground': '#233040',
        'minimap.background': '#0B1015',
        'scrollbarSlider.background': '#1E2A3680',
        'scrollbarSlider.hoverBackground': '#2A3A4C80',
        'scrollbarSlider.activeBackground': '#3A4A5C80',
      },
    });
  }, []);

  // ── Empty state ────────────────────────────────────────────────────
  if (!project) {
    return (
      <div className="ide-empty">
        <div className="ide-empty-icon-wrap">
          <Code2 size={28} strokeWidth={1.5} />
        </div>
        <p className="ide-empty-title">No code generated</p>
        <p className="ide-empty-subtitle">
          Add components to the canvas to see the generated React + Vite project
        </p>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="ide-preview">
      {/* ── Tab Bar ─────────────────────────────────────────────────── */}
      <div className="ide-tab-bar">
        <div className="ide-tab-scroll" ref={tabScrollRef}>
          {PREVIEW_FILES.map((f) => {
            const ft = getFileType(f.ext);
            const isActive = f.path === activeFile;
            return (
              <button
                key={f.path}
                ref={isActive ? activeTabRef : undefined}
                type="button"
                className="ide-tab"
                data-active={isActive}
                onClick={() => setActiveFile(f.path)}
                title={f.path}
              >
                <span className="ide-tab-dot" style={{ background: ft.color }} />
                <span className="ide-tab-label">{f.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="ide-tab-action"
          onClick={() => setShowTree(!showTree)}
          title="Toggle file tree"
          data-active={showTree}
        >
          <FolderTree size={13} />
        </button>
      </div>

      {/* ── Breadcrumb + Actions ────────────────────────────────────── */}
      <div className="ide-action-bar">
        <div className="ide-breadcrumb">
          {breadcrumbs.map((segment, i) => (
            <span key={segment} className="ide-breadcrumb-segment">
              {i > 0 && <ChevronRight size={10} className="ide-breadcrumb-sep" />}
              <span data-last={i === breadcrumbs.length - 1}>{segment}</span>
            </span>
          ))}
        </div>
        <div className="ide-action-btns">
          <button
            type="button"
            className="ide-action-btn"
            onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
            title={`Word wrap: ${wordWrap}`}
            data-active={wordWrap === 'on'}
          >
            <WrapText size={13} />
          </button>
          <button
            type="button"
            className="ide-action-btn"
            data-active={copied}
            onClick={() => void handleCopy()}
            title="Copy file to clipboard"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* ── File Tree (collapsible) ─────────────────────────────────── */}
      <div className="ide-tree-panel" data-open={showTree}>
        <div className="ide-tree-inner">
          {fileTree.children?.map((child) => (
            <TreeNodeView
              key={child.path ?? child.name}
              node={child}
              activeFile={activeFile}
              onSelect={handleTreeSelect}
              depth={0}
            />
          ))}
        </div>
      </div>

      {/* ── Monaco Editor ───────────────────────────────────────────── */}
      <div className="ide-editor" key={activeFile}>
        <Editor
          height="100%"
          language={activeFileDef?.language ?? 'typescript'}
          value={activeContent}
          theme="designforge-dark"
          beforeMount={configureMonaco}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 12.5,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            roundedSelection: true,
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            renderLineHighlight: 'gutter',
            guides: {
              indentation: true,
              bracketPairs: true,
            },
            bracketPairColorization: { enabled: true },
            smoothScrolling: true,
            wordWrap,
            domReadOnly: true,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              verticalSliderSize: 6,
              horizontalSliderSize: 6,
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>

      {/* ── Status Bar ──────────────────────────────────────────────── */}
      <div className="ide-status-bar">
        <div className="ide-status-left">
          <span className="ide-status-badge" style={{ color: activeFileType.color }}>
            <span className="ide-status-dot" style={{ background: activeFileType.color }} />
            {activeFileType.langLabel}
          </span>
        </div>
        <div className="ide-status-right">
          <span className="ide-status-item">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
          <span className="ide-status-sep" />
          <span className="ide-status-item">{formatBytes(byteSize)}</span>
          <span className="ide-status-sep" />
          <span className="ide-status-item">UTF-8</span>
        </div>
      </div>
    </div>
  );
}
