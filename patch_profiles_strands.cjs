const fs = require('fs');
let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

const targetImport = `import ChromaGrid from './ChromaGrid';`;
const replaceImport = `import ChromaGrid from './ChromaGrid';\nimport Strands from './ui/Strands';`;

if (code.includes(targetImport)) {
  code = code.replace(targetImport, replaceImport);
}

const targetDiv = `<div className="h-40 relative" style={getGradientStyle(selectedUser.departments)}>`;
const replaceDiv = `<div className="h-40 relative" style={getGradientStyle(selectedUser.departments)}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
                <Strands 
                  colors={["#ffffff", "#f8fafc", "#e2e8f0"]}
                  count={3}
                  speed={0.5}
                  amplitude={1}
                  waviness={1}
                  thickness={0.7}
                  glow={2.6}
                  taper={3}
                  spread={1}
                  intensity={0.6}
                  saturation={1.5}
                  opacity={0.7}
                  scale={1.5}
                  glass={false}
                />
              </div>`;

if (code.includes(targetDiv)) {
  code = code.replace(targetDiv, replaceDiv);
  fs.writeFileSync('src/components/ProfilesList.tsx', code);
  console.log('patched profiles strands');
} else {
  console.log('failed to find target div');
}
