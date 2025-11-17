#!/usr/bin/env node

import { readdir, rm } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const BUILD_ARTIFACTS = ['.turbo', 'node_modules', 'dist', 'build', 'expo', '.next'];

async function cleanDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist, skipping...`);
    return;
  }

  console.log(`Cleaning ${dirPath}...`);

  try {
    const items = await readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory() && BUILD_ARTIFACTS.includes(item.name)) {
        const fullPath = join(dirPath, item.name);
        try {
          await rm(fullPath, { recursive: true, force: true });
          console.log(`  ✓ Removed ${fullPath}`);
        } catch (error) {
          console.error(`  ⚠ Failed to remove ${fullPath}: ${error.message}`);
        }
      }
    }

    // Recursively clean subdirectories
    for (const item of items) {
      if (item.isDirectory() && !BUILD_ARTIFACTS.includes(item.name)) {
        const subDirPath = join(dirPath, item.name);
        await cleanDirectory(subDirPath);
      }
    }

    console.log(`✓ Cleaned ${dirPath}`);
  } catch (error) {
    console.error(`Error cleaning ${dirPath}: ${error.message}`);
  }
}

async function main() {
  console.log('Cleaning nested build artifacts...');

  // Get the project root directory (where the script is run from)
  const projectRoot = process.cwd();

  // Clean apps directory
  const appsDir = join(projectRoot, 'apps');
  if (existsSync(appsDir)) {
    await cleanDirectory(appsDir);
  } else {
    console.log('No apps directory found');
  }

  // Clean packages directory
  const packagesDir = join(projectRoot, 'packages');
  if (existsSync(packagesDir)) {
    await cleanDirectory(packagesDir);
  } else {
    console.log('No packages directory found');
  }

  console.log('✅ Nested build artifacts cleanup completed!');
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
