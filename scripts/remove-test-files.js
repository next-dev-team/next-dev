const fs = require('fs-extra');
const path = require('path');

const targetPath = process.argv[2];
const showLog = process.argv[3] === "--showLog"
if (!targetPath) {
  console.log('Please provide a target path as an argument.');
  process.exit(1);
}

const directoryPath = path.join(__dirname, '..', targetPath);

const removeTestFiles = async (dirPath) => {
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await removeTestFiles(filePath);
      } else if (file.endsWith('.test.js') || file.endsWith('.test.d.ts') || file.endsWith('.test.ts')) {
        await fs.unlink(filePath);
        showLog && console.log('Deleted test file:', filePath);
      }
    }
  } catch (err) {
    console.log('Error:', err);
  }
};

removeTestFiles(directoryPath);
