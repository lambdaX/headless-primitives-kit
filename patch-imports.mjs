#!/usr/bin/env node
// patch-imports.mjs
// Converts .ts extensions to .js extensions in compiled JavaScript files

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const DIST_PATH = './dist';

async function getAllJsFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllJsFiles(fullPath));
    } else if (extname(entry.name) === '.js') {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function patchImports() {
  console.log(`🔧 Patching import extensions in ${DIST_PATH}...`);
  
  try {
    const jsFiles = await getAllJsFiles(DIST_PATH);
    
    for (const filePath of jsFiles) {
      const originalContent = await readFile(filePath, 'utf8');
      let content = originalContent;
      
      // Replace relative imports ending with .ts to .js
      // Matches patterns like: from './file.ts' or from '../path/file.ts'
      content = content.replace(/from\s+(['"])(\.\.?\/[^'"]*?)(\.ts|\.tsx|\.js|\.jsx|\.mjs|\.cjs)?\1/g, "from $1$2.js$1");
      
      // Also handle import() dynamic imports
      content = content.replace(/import\s*\(\s*(['"])(\.\.?\/[^'"]*?)(\.ts|\.tsx|\.js|\.jsx|\.mjs|\.cjs)?\1/g, "import($1$2.js$1");
      
      // Write back only if content changed
      if (content !== originalContent) {
        await writeFile(filePath, content, 'utf8');
        console.log(`  ✅ Patched imports in ${filePath}`);
      } else {
        console.log(`  ➖ No changes needed in ${filePath}`);
      }
    }
    
    console.log('🎉 Import patching complete!');
  } catch (error) {
    console.error('❌ Error patching imports:', error);
    process.exit(1);
  }
}

patchImports();