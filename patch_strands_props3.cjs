const fs = require('fs');
let deptsCode = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');
let profilesCode = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

const targetProps = `count={6}
              speed={0.4}
              amplitude={4}
              waviness={1.5}
              thickness={2}
              glow={3}
              taper={0.2}
              spread={3}
              intensity={0.8}
              saturation={1.5}
              opacity={0.9}
              scale={3.5}`;

const replaceProps = `count={4}
              speed={0.5}
              amplitude={1.5}
              waviness={1}
              thickness={1}
              glow={2.8}
              taper={1}
              spread={1.5}
              intensity={0.7}
              saturation={1.5}
              opacity={0.8}
              scale={2.2}`;

if (deptsCode.includes(targetProps)) {
  deptsCode = deptsCode.replace(targetProps, replaceProps);
  fs.writeFileSync('src/components/DepartmentsList.tsx', deptsCode);
  console.log('patched depts');
}

const targetPropsProfiles = `count={6}
                  speed={0.4}
                  amplitude={4}
                  waviness={1.5}
                  thickness={2}
                  glow={3}
                  taper={0.2}
                  spread={3}
                  intensity={0.8}
                  saturation={1.5}
                  opacity={0.9}
                  scale={3.5}`;

const replacePropsProfiles = `count={4}
                  speed={0.5}
                  amplitude={1.5}
                  waviness={1}
                  thickness={1}
                  glow={2.8}
                  taper={1}
                  spread={1.5}
                  intensity={0.7}
                  saturation={1.5}
                  opacity={0.8}
                  scale={2.2}`;

if (profilesCode.includes(targetPropsProfiles)) {
  profilesCode = profilesCode.replace(targetPropsProfiles, replacePropsProfiles);
  fs.writeFileSync('src/components/ProfilesList.tsx', profilesCode);
  console.log('patched profiles');
}
