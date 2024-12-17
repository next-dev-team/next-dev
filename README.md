# WIP

[Edit Tips](https://github.com/next-dev-team/next-dev/edit/main/docs/tips.md)

development in progress


# Next Dev

Next Dev(Next Generation Dev) is an open source team to sharing all related fullstack resources with the community

## Architecture

We decided to use Monorepo to manage our system, we see [Turborepo](https://github.com/vercel/turbo) is powerful and fast speed monorepo working along with Changesets to manage versioning and package publishing.
As well as a few others tools preconfigured:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Changesets](https://github.com/changesets/changesets) for managing versioning and changelogs
- [GitHub Actions](https://github.com/changesets/action) for fully automated package publishing

## What's inside?

Next Dev includes Boilerplate, Example, Docs and Packages

### Packages Folder

Inside the package folder is the packages that we can shared to boilerplate, example, docs or publish it to NPM and so on.

- `@next-dev/cli`: UI components with Ant Design
- `@next-dev/antd-ui`: UI components with Ant Design
- `@next-dev/utils`: shared javascript utilities
- `@next-dev/configs`: shared `config`
- `@next-dev/lints`: Lint preset
- `@next-dev/ui`: UI components with Tailwind CSS and more
- `@next-dev/rn-ui`: React native UI components

### Docs Folder

Inside the docs folder is a placeholder site for documentation ,demo, blog for [Next Dev](https://next-dev-team.github.io/next-dev) powered by [Dumi v2](https://d.umijs.org/)

### Boilerplate Folder

Inside the Boilerplate folder is boilerplate both frontend and backend

- `nextjs-web`: NextJs v13 - (ReactJs Framework), boilerplate for website with hybrid(SSR and SSG) rendering
- `nuxt3-web`: Nuxt 3 - (VueJs Framework), VueJs boilerplate for website with hybrid(SSR and SSG) rendering
- `react-next-admin`: Umi 4 - (ReactJs) ,boilerplate for Admin or backstage
- `vue-next-admin`: Vue 3, boilerplate for Admin or backstage
- `rn-next`: React Native, boilerplate for Hybrid Mobile(Android ad IOS)
- `rn-next-universal`: React Native, boilerplate for universal (Android, iOS, macOS,tvOS, Windows, web, browser extensions, Electron.)

### Development Commands

- `pnpm build` - Build all packages including the Storybook site
- `pnpm dev` - Run all packages locally and docs development
- `pnpm lint` - Lint all packages
- `pnpm changeset` - Generate a changeset
- `pnpm clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)

## Caution

While a monorepo offers numerous advantages, it can be challenging to handle versions. Currently, the system only supports a single version (meaning all applications, such as app1, app2, and packages, must use the same version, for instance, React v18).

### Clone a single example or boilerplate

Run the following command:

```sh
npx degit next-dev-team/next-dev/boilerplate/nextjs-web nextjs-web
cd nextjs-web
pnpm install
git init . && git add . && git commit -m "Init"
```

### Contributing

coming soon

### Community

coming soon
