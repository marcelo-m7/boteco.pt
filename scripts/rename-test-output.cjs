const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'dist-tests');
const srcRoot = path.join(root, 'src');

const rewriteAliases = (filePath) => {
  const dir = path.dirname(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  const pattern = /require\((['\"])@\/(.+?)\1\)/g;
  content = content.replace(pattern, (match, quote, subPath) => {
    const target = path.join(srcRoot, subPath);
    let relative = path.relative(dir, target);
    if (!relative.startsWith('.')) {
      relative = `./${relative}`;
    }
    relative = relative.replace(/\\/g, '/');
    return `require(${quote}${relative}${quote})`;
  });
  fs.writeFileSync(filePath, content);
};

const processFiles = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processFiles(fullPath);
    } else if (stat.isFile() && fullPath.endsWith('.js')) {
      rewriteAliases(fullPath);
    }
  }
};

const renameTestFiles = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      renameTestFiles(fullPath);
    } else if (stat.isFile() && /\.test\.js$/.test(entry)) {
      const target = fullPath.replace(/\.test\.js$/, '.test.cjs');
      fs.renameSync(fullPath, target);
    }
  }
};

processFiles(root);
renameTestFiles(root);

if (fs.existsSync(root)) {
  const pkgPath = path.join(root, 'package.json');
  fs.writeFileSync(pkgPath, JSON.stringify({ type: 'commonjs' }, null, 2));
}
