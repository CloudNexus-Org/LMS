const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  content = content.replace(/from\s+['"]@\/ui\//g, "from '@/components/ui/");
  content = content.replace(/from\s+['"]@\/layout\//g, "from '@/components/layout/");
  content = content.replace(/from\s+['"]@\/sections\//g, "from '@/components/sections/");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed aliases in:', filePath);
  }
});
