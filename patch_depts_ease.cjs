const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const targetProps = `borderRadius={0.5}
                  scrollSpeed={2}
                  onItemClick={(item) => {`;

const replaceProps = `borderRadius={0.5}
                  scrollSpeed={1.5}
                  scrollEase={0.015}
                  onItemClick={(item) => {`;

if (code.includes(targetProps)) {
  code = code.replace(targetProps, replaceProps);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('patched ease');
} else {
  console.log('failed to find ease target');
}
