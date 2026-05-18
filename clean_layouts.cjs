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

walkDir('./src/pages', (filePath) => {
  if (!filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Remove import lines for Navbar and Footer
  content = content.replace(/^.*import\s+Navbar.*$/gm, '');
  content = content.replace(/^.*import\s+Footer.*$/gm, '');
  
  // Remove the components
  content = content.replace(/<Navbar\s*\/>/g, '');
  content = content.replace(/<Footer\s*\/>/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Cleaned Navbar/Footer from:', filePath);
  }
});
