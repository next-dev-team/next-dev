// ─── Template type and registry ─────────────────────────────

export interface ProjectTemplate {
  name: string;
  label: string;
  description: string;
  /** Subfolder in templates/ (e.g. 'vite/counter') */
  templateDir: string;
  /** If set, run this CLI instead of copying pre-template files */
  scaffold?: string;
}

/**
 * Built-in templates.
 * Templates with no `scaffold` use pre-template files from templates/<templateDir>/.
 * Templates with `scaffold` run the CLI command and layer .agents/ on top.
 *
 * Add new templates here — just define the entry and optionally
 * add a templates/<templateDir>/ directory with pre-template files.
 */
export const TEMPLATES: Record<string, ProjectTemplate> = {
  vite: {
    name: 'vite',
    label: 'Vite + React + TypeScript',
    description: 'React counter app with Vite, TypeScript, and agent config',
    templateDir: 'vite/counter',
    // Pre-template — no network needed
  },
};

export const templateNames = Object.keys(TEMPLATES);
