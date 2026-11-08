const fs = require('fs');
let code = fs.readFileSync('src/components/About.tsx', 'utf8');

const target = `className="max-w-4xl prose prose-neutral text-neutral-800 prose-headings:text-neutral-900 prose-a:text-primary prose-strong:text-neutral-900 leading-relaxed text-right" dir="rtl"`;
              
const repl = `className="max-w-4xl text-neutral-800 leading-relaxed text-right space-y-4" dir="rtl"`;

// Since prose might be hiding it, let's remove prose for a moment
// And we also need to add styles for p, h3, etc. but let's just see if it appears.
// Wait, react-markdown without prose will just render raw text with no margins.

code = code.replace(target, repl);

// Also add a custom component mapping to Markdown to ensure styles are applied without prose
const markdownTarget = `<Markdown>{aboutInfo?.content || defaultContent}</Markdown>`;
const markdownRepl = `<Markdown
                  components={{
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-neutral-900 mt-6 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="text-neutral-700 leading-relaxed mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-neutral-700" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-neutral-900" {...props} />,
                    a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />
                  }}
                >
                  {aboutInfo?.content || defaultContent}
                </Markdown>`;

code = code.replace(markdownTarget, markdownRepl);

fs.writeFileSync('src/components/About.tsx', code);
console.log('patched markdown rendering');
