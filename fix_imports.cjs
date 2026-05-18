const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function fixImports(filePath) {
  if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace imports like: import X from '../../components' -> import X from '@/components'
  content = content.replace(/from\s+['"](?:\.\.\/)+([^'"]+)['"]/g, (match, rest) => {
    return `from '@/${rest}'`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed imports in:', filePath);
  }
}

walkDir('./src', fixImports);
console.log('Done mapping aliases.');
