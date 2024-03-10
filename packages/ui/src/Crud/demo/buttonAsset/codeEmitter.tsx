import { generateJSXCode } from '@ant-design/pro-editor';
// @ts-ignore
import template from 'lodash.template';

const codeTemplate = `
import { Crud } from '@next-dev/ui';

 <%= component %>;
`;

interface TemplateParams {
  iconDeps?: string;
  component: string;
}

const emitter: (params: TemplateParams) => string = template(codeTemplate);

const codeEmitter = (config: Record<string, any>) => {
  const code = emitter({
    component: generateJSXCode('Crud', {
      ...config,
    }),
  });
  return code;
};

export default codeEmitter;
