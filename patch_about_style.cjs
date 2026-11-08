const fs = require('fs');
let code = fs.readFileSync('src/components/About.tsx', 'utf8');

const target = `              <div className="max-w-4xl prose prose-neutral prose-primary prose-a:text-primary hover:prose-a:text-primary-dark prose-headings:text-neutral-800 prose-strong:text-neutral-800 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-primary" dir="rtl">
                <Markdown>{aboutInfo?.content || defaultContent}</Markdown>
              </div>`;
              
const repl = `              <div className="max-w-4xl prose prose-neutral text-neutral-800 prose-headings:text-neutral-900 prose-a:text-primary prose-strong:text-neutral-900 leading-relaxed text-right" dir="rtl">
                <Markdown>{aboutInfo?.content || defaultContent}</Markdown>
              </div>`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/About.tsx', code);
console.log('patched styling');
