const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const targetProps = `bend={3}
                  font="bold 20px Vazirmatn, sans-serif"
                  fontUrl="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap"
                  textColor="#171717"
                  borderRadius={0.5}
                  scrollSpeed={1.5}
                  scrollEase={0.015}`;

const replaceProps = `bend={0}
                  font="bold 20px Vazirmatn, sans-serif"
                  fontUrl="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap"
                  textColor="#171717"
                  borderRadius={0.5}
                  scrollSpeed={3}
                  scrollEase={0.05}`;

if (code.includes(targetProps)) {
  code = code.replace(targetProps, replaceProps);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('patched speed and bend');
} else {
  console.log('failed to find speed target');
}
