#!/usr/bin/env node

import { readdir, rm } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import readline from 'readline';

const BUILD_ARTIFACTS = ['.turbo', 'node_modules', 'dist', 'build', 'expo', '.next'];

function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim() === 'y' || answer.toLowerCase().trim() === 'yes');
    });
  });
}

async function cleanRootArtifacts(projectRoot) {
  console.log('\nCleaning root level build artifacts...');

  try {
    const items = await readdir(projectRoot, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory() && BUILD_ARTIFACTS.includes(item.name)) {
        const fullPath = join(projectRoot, item.name);
        try {
          await rm(fullPath, { recursive: true, force: true });
          console.log(`  ✓ Removed ${fullPath}`);
        } catch (error) {
          console.error(`  ⚠ Failed to remove ${fullPath}: ${error.message}`);
        }
      }
    }

    console.log('✓ Root level cleanup completed');
  } catch (error) {
    console.error(`Error cleaning root artifacts: ${error.message}`);
  }
}

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
  // Get the project root directory (where the script is run from)
  const projectRoot = process.cwd();

  console.log('🧹 Build Artifacts Cleanup Script');
  console.log('================================\n');
  console.log('This will remove the following build artifacts:');
  console.log(`  ${BUILD_ARTIFACTS.join(', ')}\n`);
  console.log('Locations to clean:');
  console.log(`  - Root level: ${projectRoot}`);

  const appsDir = join(projectRoot, 'apps');
  const packagesDir = join(projectRoot, 'packages');

  if (existsSync(appsDir)) {
    console.log(`  - Nested in: ${appsDir}`);
  }
  if (existsSync(packagesDir)) {
    console.log(`  - Nested in: ${packagesDir}`);
  }

  console.log('');

  // Ask for confirmation
  const confirmed = await askConfirmation('Do you want to proceed? (y/N): ');

  if (!confirmed) {
    console.log('❌ Cleanup cancelled.');
    process.exit(0);
  }

  console.log('\n🚀 Starting cleanup...\n');

  // Clean root level artifacts first
  await cleanRootArtifacts(projectRoot);

  // Clean apps directory
  if (existsSync(appsDir)) {
    await cleanDirectory(appsDir);
  } else {
    console.log('No apps directory found');
  }

  // Clean packages directory
  if (existsSync(packagesDir)) {
    await cleanDirectory(packagesDir);
  } else {
    console.log('No packages directory found');
  }

  console.log('\n✅ Build artifacts cleanup completed!');
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
