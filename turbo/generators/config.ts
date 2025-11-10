import type { PlopTypes } from '@turbo/gen';
import path from 'node:path';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('tron-mini', {
    description: 'Scaffold a minimal Tron UI plugin (Hello Tron Mini)',
    prompts: [
      {
        type: 'input',
        name: 'pluginSlug',
        message: 'Workspace folder name (apps/<name>)',
        default: 'tron-mini',
      },
      {
        type: 'input',
        name: 'pluginName',
        message: 'Plugin display name',
        default: 'Hello Tron Mini',
      },
      {
        type: 'input',
        name: 'version',
        message: 'Plugin version',
        default: '0.1.0',
      },
      {
        type: 'input',
        name: 'port',
        message: 'Dev server port',
        default: '3002',
      },
      {
        type: 'input',
        name: 'previewPort',
        message: 'Preview server port',
        default: '3001',
      },
    ],
    actions: [
      function setPaths(answers: any) {
        const plopfileDir = plop.getPlopfilePath();
        const rootDir = path.dirname(path.dirname(plopfileDir));
        const base = path.resolve(plopfileDir, 'templates', 'tron-mini');
        const destBase = path.join(rootDir, 'apps');
        // expose to handlebars via answers
        (answers as any).templateBase = base;
        (answers as any).destBase = destBase;
        return `Templates: ${base} | Destination base: ${destBase}`;
      },
      {
        type: 'addMany',
        destination: '{{destBase}}/{{kebabCase pluginSlug}}',
        base: '{{templateBase}}',
        templateFiles: '{{templateBase}}/**/*',
      },
    ],
  });
}
