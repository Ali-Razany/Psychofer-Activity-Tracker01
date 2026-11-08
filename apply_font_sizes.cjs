const fs = require('fs');
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

const allFiles = getFiles('src');

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Convert specific exact custom sizes on mobile to 12px or 14px
  content = content.replace(/(?<!(sm:|md:|lg:|xl:|2xl:))text-\[9px\]/g, 'text-[12px]');
  content = content.replace(/(?<!(sm:|md:|lg:|xl:|2xl:))text-\[10px\]/g, 'text-[12px]');
  content = content.replace(/(?<!(sm:|md:|lg:|xl:|2xl:))text-\[11px\]/g, 'text-[12px]');
  content = content.replace(/(?<!(sm:|md:|lg:|xl:|2xl:))text-\[13px\]/g, 'text-[14px]');
  content = content.replace(/(?<!(sm:|md:|lg:|xl:|2xl:))text-\[15px\]/g, 'text-[14px]');

  // 2. Make all headings 14px on mobile
  content = content.replace(/<(h[1-6])([^>]*)className="([^"]*)"/g, (match, tag, beforeClass, classNames) => {
    let newClasses = classNames.replace(/(?<!(sm:|md:|lg:|xl:|2xl:))text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])/g, '');
    newClasses = 'text-[14px] ' + newClasses.trim();
    newClasses = newClasses.replace(/\s+/g, ' ');
    return `<${tag}${beforeClass}className="${newClasses}"`;
  });

  // 3. Make paragraphs, spans, buttons 12px on mobile if they were sm or base
  content = content.replace(/<(p|span|button|div)([^>]*)className="([^"]*)"/g, (match, tag, beforeClass, classNames) => {
    let newClasses = classNames;
    if (/(?<!(sm:|md:|lg:|xl:|2xl:))text-sm/.test(newClasses)) {
       newClasses = newClasses.replace(/(?<!(sm:|md:|lg:|xl:|2xl:))text-sm/g, 'text-[12px] sm:text-sm');
    }
    if (/(?<!(sm:|md:|lg:|xl:|2xl:))text-base/.test(newClasses)) {
       newClasses = newClasses.replace(/(?<!(sm:|md:|lg:|xl:|2xl:))text-base/g, 'text-[12px] sm:text-base');
    }
    return `<${tag}${beforeClass}className="${newClasses}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});

console.log("Fonts applied successfully.");
