const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const targetProps = `bend={3}
                  font="bold 20px NRT, NAKA, sans-serif"
                  fontUrl=""
                  textColor="#171717"
                  borderRadius={0.05}
                  scrollSpeed={3}`;

const replaceProps = `bend={3}
                  font="bold 20px Vazirmatn, sans-serif"
                  fontUrl="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap"
                  textColor="#171717"
                  borderRadius={0.5}
                  scrollSpeed={2}`;

if (code.includes(targetProps)) {
  code = code.replace(targetProps, replaceProps);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('patched DepartmentsList props');
} else {
  console.log('failed to find target props');
}
