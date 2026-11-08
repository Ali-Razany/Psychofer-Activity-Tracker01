const fs = require('fs');
const glob = require('glob'); // Not available by default, we'll use fs.readdirSync recursively
const path = require('path');

function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.endsWith('.tsx') || name.endsWith('.ts')) {
        files_.push(name);
      }
    }
  }
  return files_;
}

const allFiles = getFiles('src/components');

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace text-xl md:text-2xl with text-[15px] md:text-2xl
  content = content.replace(/text-xl md:text-2xl/g, 'text-[15px] md:text-2xl');
  content = content.replace(/text-xl md:text-3xl/g, 'text-[15px] md:text-3xl');
  
  // Replace text-xl font-* with text-[15px] md:text-xl font-*
  content = content.replace(/text-xl font-bold/g, 'text-[15px] md:text-xl font-bold');
  content = content.replace(/text-xl font-semibold/g, 'text-[15px] md:text-xl font-semibold');
  content = content.replace(/text-xl font-extrabold/g, 'text-[15px] md:text-xl font-extrabold');

  // Replace text-lg font-* with text-[14px] md:text-lg font-* (unless already has sm: or md:)
  // We'll use a regex that avoids if it's already responsive
  content = content.replace(/(?<!(md:|sm:|lg:|\[\d+px\]\s))text-lg font-bold/g, 'text-[14px] md:text-lg font-bold');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});

