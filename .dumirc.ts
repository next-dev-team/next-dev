import { defineConfig } from 'dumi';
import type { SiteThemeConfig } from 'dumi-theme-antd-style';
import { readdirSync } from 'fs';
import { join } from 'path';

// more example about dumi https://github.com/thundersdata-frontend/td-design
// https://github.com/ant-design/pro-components/blob/master/.dumirc.ts

// @ts-ignore
import { homepage, name } from './package.json';

const isProd = process.env.NODE_ENV === 'production';

const headPkgList: string[] = [];
// utils must build before core
// runtime must build before renderer-react
const pkgList = readdirSync(join(__dirname, 'packages')).filter(
  (pkg) => pkg.charAt(0) !== '.' && !headPkgList.includes(pkg),
);

const tailPkgList = pkgList.map((path) => {
  return {
    src: `packages/${path}/src/`,
    path,
  };
});

console.log('tailPkgList', pkgList);

const themeConfig: SiteThemeConfig = {
  name: 'Next Dev',
  // logo: 'https://gw.alipayobjects.com/zos/hitu-asset/c88e3678-6900-4289-8538-31367c2d30f2/hitu-1609235995955-image.png',
  socialLinks: { github: homepage },
  apiHeader: {
    pkg: name,
    sourceUrl: `{github}/tree/master/src/components/{atomId}/index.tsx`,
    docUrl: `{github}/tree/master/example/docs/components/{atomId}.{locale}.md`,
  },
  footer: 'Made with ❤️ by Next Dev',
};

export default defineConfig({
  themeConfig: {
    ...themeConfig,
    // nav: [{ title: 'Docs', link: '/packages/utils' }],
  },
  html2sketch: {},
  favicons: [
    'https://gw.alipayobjects.com/zos/hitu-asset/c88e3678-6900-4289-8538-31367c2d30f2/hitu-1609235995955-image.png',
  ],
  locales: [
    { id: 'en-US', name: 'English' },
    // { id: 'zh-CN', name: '中文' },
  ],
  alias: {},
  styles: [
    `html, body { background: transparent;  }

  @media (prefers-color-scheme: dark) {
    html, body { background: #0E1116; }
  }`,
  ],
  extraBabelPlugins: ['antd-style'],
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  // @ts-ignore
  ssr: isProd ? {} : false,
  mfsu: false,
  resolve: {
    // Configure the entry file path, API parsing will start from here
    // entryFile: './packages/utils/src/index.ts',
    // auto generate docs
    atomDirs: [
      ...tailPkgList.map(({ src, path }) => ({
        type: path,
        dir: src,
      })),
    ],
  },
});
// import { defineConfig } from 'dumi';

// export default defineConfig({
//   plugins: [require.resolve('@umijs/plugins/dist/tailwindcss')],
//   tailwindcss: {},
//   locales: [{ id: 'en-US', name: 'EN', suffix: '' }],
//   // Configure additional umi plugins.
//   mfsu: false,
//   alias: {},
//   // apiParser: {},
//   resolve: {
//     // Configure the entry file path, API parsing will start from here
//     // entryFile: './packages/utils/src/index.ts',
//     // auto generate docs
//     atomDirs: [
//       // antd-ui
//       // TW UI
//       { type: 'tw-ui', dir: 'packages/ui/src' },
//       { type: 'tw-ui', dir: 'packages/ui/' },
//     ],
//   },
//   favicons: [
//     'https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png',
//   ],
//   // autoAlias: false,
//   outputPath: 'dist',
//   publicPath: '/next-dev/',
//   base: '/next-dev/',
//   themeConfig: {
//     name: 'Next Dev',
//     logo: 'https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png',
//     footer: `Open-source MIT Licensed | Copyright © 2019-${new Date().getFullYear()}<br /> Powered by Next Dev`,
//   },
//   chainWebpack(config: any, { webpack }: any) {
//     config.module.rule('ts-in-node_modules').include.clear();

//     //Introduce global public methods
//     config.plugin('$global').use(
//       // https://webpack.js.org/plugins/provide-plugin/
//       new webpack.ProvidePlugin({}),
//     );

//     return config;
//   },
// });
