# Install dependencies first
pnpm -C apps/electron install

# Build for current platform (macOS)
pnpm -C apps/electron build:mac

# Or build for all platforms
pnpm -C apps/electron build