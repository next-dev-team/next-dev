import type { NextConfig } from "next";
import { codeInspectorPlugin } from "code-inspector-plugin";

const nextConfig: NextConfig = {
  // Explicitly set the base path to resolve workspace root issues
  basePath: "",
  // Ensure proper asset handling
  assetPrefix: undefined,
  // Enable standalone output for better deployment
  output: "standalone",
  // Configure TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configure Turbopack root directory to fix workspace warning
  turbopack: {
    rules: codeInspectorPlugin({
      bundler: "turbopack",
      hotKeys: ["ctrlKey", 'shiftKey', 'altKey'],
    }),
  },
};

export default nextConfig;
