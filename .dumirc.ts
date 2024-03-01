import chalk from 'chalk'
import { defineConfig } from 'dumi'
import type { SiteThemeConfig } from 'dumi-theme-antd-style'
import { readdirSync } from 'fs'
import { join } from 'path'
const { TamaguiPlugin } = require('tamagui-loader')
// more example about dumi https://github.com/thundersdata-frontend/td-design
// https://github.com/ant-design/pro-components/blob/master/.dumirc.ts

// @ts-ignore
import { homepage, name } from './package.json'

const isProd = process.env.NODE_ENV === 'production'

const headPkgList: string[] = []
// utils must build before core
// runtime must build before renderer-react
const pkgList = readdirSync(join(__dirname, 'packages')).filter(
  (pkg) => pkg.charAt(0) !== '.' && !headPkgList.includes(pkg)
)

const tailPkgList = pkgList.map((path) => {
  return {
    src: `packages/${path}/src/`,
    path,
  }
})

const alias = pkgList.reduce(
  (pre, pkg) => {
    pre[`@next-dev/${pkg}`] = join(__dirname, 'packages', pkg, 'src')
    return {
      ...pre,
    }
  },
  {} as Record<string, string>
)

console.log(`🌼 alias list \n${chalk.blue(Object.keys(alias).join('\n'))}`)

// console.log('tailPkgList', pkgList)

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
}

export default defineConfig({
  plugins: [require.resolve('@umijs/plugins/dist/tailwindcss')],
  tailwindcss: {},
  themeConfig: {
    hd: { rules: [] },
    ...themeConfig,
    // nav: [{ title: 'Docs', link: '/packages/utils' }],
  },
  // html2sketch: {},
  favicons: [
    'https://gw.alipayobjects.com/zos/hitu-asset/c88e3678-6900-4289-8538-31367c2d30f2/hitu-1609235995955-image.png',
  ],
  locales: [
    { id: 'en-US', name: 'English' },
    // { id: 'zh-CN', name: '中文' },
  ],
  alias,
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
  fastRefresh: true,
  ssr: false,
  exportStatic: {},
  mfsu: {
    exclude: ['dumi-theme-antd-style', /dumi/, '@ant-design/cssinjs'],
    shared: {
      react: {
        singleton: true,
      },
    },
  },
  // mfsu: false,
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

  npmClient: 'yarn',
  chainWebpack(config, { webpack }) {
    config.resolve.alias.batch(() => {
      return {
        'react-native': 'react-native-web-lite',
        'react-native-svg': '@tamagui/react-native-svg',
        '@expo/vector-icons': '@tamagui/proxy-worm',
      }
    })

    // Add the new TamaguiPlugin to the plugins array
    config.plugin('provide').use(
      new TamaguiPlugin({
        // config: './tamagui.config.ts',
        components: [],
        importsWhitelist: ['constants.js', 'colors.js'],
        logTimings: true,
        disableExtraction: process.env.NODE_ENV === 'development',
      })
    )
    config.resolve.extensions.batch(() => ['demo.tsx'])
    config.plugin('$global').use(
      // https://webpack.js.org/plugins/provide-plugin/
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        __DEV__: process.env.NODE_ENV !== 'production' || true,
      })
    )

    return config
  },
})
