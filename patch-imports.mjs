#!/usr/bin/env node
// patch-imports.mjs
// Post-processes compiled JavaScript files to fix module imports for browser compatibility

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const DIST_PATH = './dist';

// Map of bare module specifiers to their CDN URLs
const CDN_MAPPINGS = {
  'react': 'https://esm.sh/react@18.3.1',
  'react-dom': 'https://esm.sh/react-dom@18.3.1',
  // Add more dependencies as needed
};

async function getAllJsFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllJsFiles(fullPath));
    } else if (extname(entry.name) === '.js' || extname(entry.name) === '.mjs') {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Replaces bare module specifiers with their CDN URLs
 */
function replaceBareModuleImports(content) {
  // Handle import statements
  content = content.replace(
    /from\s+['"]([^.'"@][^/"]*[^/"])['"]/g, 
    (match, pkg) => {
      if (CDN_MAPPINGS[pkg]) {
        return `from '${CDN_MAPPINGS[pkg]}'`;
      }
      return match;
    }
  );

  // Handle dynamic imports
  content = content.replace(
    /import\s*\(\s*['"]([^.'"@][^/"]*[^/"])['"]/g,
    (match, pkg) => {
      if (CDN_MAPPINGS[pkg]) {
        return `import('${CDN_MAPPINGS[pkg]}'`;
      }
      return match;
    }
  );

  return content;
}

/**
 * Ensures all relative imports have .js extensions
 */
function ensureJsExtensions(content) {
  // Handle relative imports in from clauses
  content = content.replace(
    /from\s+(['"])(\.\.?\/[^'"]*?)(\.[a-z0-9]+)?(['"])/gi,
    (match, quote1, path, ext, quote2) => {
      // Only modify if it doesn't already have an extension
      if (!ext) {
        return `from ${quote1}${path}.js${quote2}`;
      }
      // If it has an extension, ensure it's .js
      if (ext.toLowerCase() !== '.js') {
        return `from ${quote1}${path}.js${quote2}`;
      }
      return match;
    }
  );

  // Handle dynamic imports
  content = content.replace(
    /import\s*\(\s*(['"])(\.\.?\/[^'"]*?)(\.[a-z0-9]+)?(['"])/gi,
    (match, quote1, path, ext, quote2) => {
      if (!ext) {
        return `import(${quote1}${path}.js${quote2}`;
      }
      if (ext.toLowerCase() !== '.js') {
        return `import(${quote1}${path}.js${quote2}`;
      }
      return match;
    }
  );

  return content;
}

async function patchImports() {
  console.log(`🔧 Patching imports in ${DIST_PATH}...`);
  
  try {
    const jsFiles = await getAllJsFiles(DIST_PATH);
    let patchedFiles = 0;
    
    for (const filePath of jsFiles) {
      const originalContent = await readFile(filePath, 'utf8');
      let content = originalContent;
      
      // Apply transformations
      content = ensureJsExtensions(content);
      content = replaceBareModuleImports(content);
      
      // Write back only if content changed
      if (content !== originalContent) {
        await writeFile(filePath, content, 'utf8');
        console.log(`  ✅ Patched imports in ${filePath}`);
        patchedFiles++;
      }
    }
    
    console.log(`🎉 Import patching complete! Patched ${patchedFiles} files.`);
  } catch (error) {
    console.error('❌ Error patching imports:', error);
    process.exit(1);
  }
}

// Run the patching
patchImports();