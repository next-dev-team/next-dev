# Common Mono-repo issue

The issue you're experiencing with Next.js 15 and Next.js 16 in a Turborepo monorepo is likely due to dependency hoisting and shared node_modules, not a Turborepo limitation. Turborepo itself can handle different versions, but the underlying package manager behavior causes conflicts.
Why This Happens

Package Manager Hoisting: Package managers (npm, yarn, pnpm) try to hoist shared dependencies to the root node_modules. When both Next.js 15 and 16 are in the same monorepo, their conflicting peer dependencies (React versions, webpack configs, etc.) create conflicts.
Shared Dependencies: Next.js 15 and 16 likely require different versions of React, webpack, and other core dependencies. When hoisted, only one version wins, breaking the other app.
Module Resolution: Node's module resolution algorithm looks up the tree, so even if you specify different versions in each app's package.json, the hoisted version may be used instead.

Solutions
Option 1: Use pnpm (Recommended)
pnpm has better isolation and can handle this better:
json// pnpm-workspace.yaml
packages:

- 'apps/\*'
- 'packages/_'
  json// .npmrc
  node-linker=isolated
  Option 2: Prevent Hoisting
  For npm/yarn, prevent specific packages from hoisting:
  json// package.json (root)
  {
  "workspaces": {
  "packages": ["apps/_", "packages/\*"],
  "nohoist": ["**/next", "**/react", "**/react-dom"]
  }
  }
  Option 3: Separate Turborepo Instances
  If the apps are truly independent, consider separate monorepos or running them in different Turborepo workspaces with isolated dependency trees.
  Option 4: Use Docker/Containers
  Build each app in isolated containers where dependencies don't conflict.
  Best Practice
  If possible, keep all apps on the same Next.js version in a monorepo. Mixing major versions is technically possible but adds significant complexity. If you must use different versions, pnpm with proper isolation is your best bet.
  Does this help clarify the issue? What package manager are you currently using?RetryZnow i use pnpm with node-linker=hoisted
  that why it error right?Yes, exactly! That's the root cause of your problem.
  node-linker=hoisted makes pnpm behave like npm/yarn by hoisting all dependencies to the root node_modules. This causes the same conflicts you'd get with other package managers when Next.js 15 and 16 try to share dependencies.
  Fix It
  Change your .npmrc file:
  ini# Remove or change this:

# node-linker=hoisted

# To this (or just remove the line entirely - isolated is pnpm's default):

node-linker=isolated
Then reinstall dependencies:
bash# Delete existing node_modules and lockfile
rm -rf node_modules apps/\*/node_modules pnpm-lock.yaml

# Reinstall with isolated mode

pnpm install
What This Does

isolated (default): Each workspace gets its own node_modules with proper isolation using symlinks
hoisted: Everything gets hoisted to root (causes your current problem)

With node-linker=isolated, your Next.js 15 app will have its own dependency tree, and your Next.js 16 app will have its own separate dependency tree, preventing conflicts.
Alternative: Stricter Isolation
If you still have issues, you can also add:
inishamefully-hoist=false
public-hoist-pattern[]=_eslint_
public-hoist-pattern[]=_prettier_
This ensures even stricter isolation while still allowing some dev tools to be shared.
Try changing to isolated mode and reinstalling - your apps should work together after that! 🚀RetryZhow about packages/ui,etc it can be share to apps?Yes! Packages like packages/ui can still be shared perfectly even with node-linker=isolated. That's the beauty of pnpm - it handles internal workspace packages separately from external dependencies.
How It Works
With node-linker=isolated:

✅ Internal packages (packages/ui, packages/config, etc.) are shared via symlinks across all apps
✅ External dependencies (Next.js, React, etc.) are isolated per workspace
✅ Each app can use different versions of external deps while sharing internal packages

Example Structure
apps/
next15/
package.json # "ui": "workspace:\*" - shares packages/ui
node_modules/
next/ # v15.x.x (isolated)
react/ # v18.x.x
ui/ # -> symlink to ../../packages/ui

next16/
package.json # "ui": "workspace:\*" - shares same packages/ui
node_modules/
next/ # v16.x.x (isolated, different version!)
react/ # v19.x.x
ui/ # -> symlink to ../../packages/ui (same package!)

packages/
ui/
package.json # Shared by both apps
Your Package.json
json// apps/next15/package.json
{
"dependencies": {
"next": "^15.0.0",
"ui": "workspace:\*" // ✅ Shares packages/ui
}
}

// apps/next16/package.json
{
"dependencies": {
"next": "^16.0.0",
"ui": "workspace:_" // ✅ Shares same packages/ui
}
}
Important Consideration
Your packages/ui dependencies matter:
If packages/ui has react as a dependency, both apps need compatible React versions:
json// packages/ui/package.json
{
"peerDependencies": {
"react": "^18.0.0 || ^19.0.0" // ✅ Works with both
}
}
Or use devDependencies for build-time only:
json{
"devDependencies": {
"react": "_" // Only for development
},
"peerDependencies": {
"react": "\*" // Apps provide their own
}
}
TL;DR: Change to isolated mode and your internal packages will still share perfectly while external dependencies stay isolated! 🎯
