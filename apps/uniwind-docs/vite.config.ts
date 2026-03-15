import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import * as MdxConfig from './source.config';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.js',
      '.tsx',
      '.ts',
      '.js',
      '.json',
    ],
  },
  plugins: [
    mdx(MdxConfig),
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    react(),
  ],
});
