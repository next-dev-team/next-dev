# React Native Reusables registry template

Bringing [shadcn/ui](https://ui.shadcn.com) to React Native. Beautifully crafted components with [Nativewind](https://www.nativewind.dev/), open source, and almost as easy to use.</i>

![hero](apps/docs/public/og.png)

## Getting Started

This is a template for creating a custom registry using Next.js or Expo.

- The template uses a `registry.json` file to define components and their files. These are found in both `apps/docs` and `apps/showcase` folders.
- The `shadcn build` command is used to build the registry.
- You can use `turbo registry` to build the registry. This will generate the `public/r` folders in both `apps/docs` and `apps/showcase`.
- The registry items are served as static files under `public/r/[name].json`.
- Every registry item are compatible with the `shadcn` CLI.

## Documentation

Visit https://rnr-registry-template-docs.vercel.app/ to view the documentation.

## Community Resources

See the [community resources](./COMMUNITY_RESOURCES.md) for community-maintained components, libraries, and templates.

## License

Licensed under the [MIT license](/LICENSE).

## Credits

- [react-native-reusables](https://reactnativereusables.com) for the inspiration and the template.