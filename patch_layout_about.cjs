const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const targetMenu = `{ id: "public-comments", label: "دیوەخانی گشتی", icon: <Icon icon="fluent-emoji:speech-balloon" width={20} /> }`;
const newMenu = `{ id: "public-comments", label: "دیوەخانی گشتی", icon: <Icon icon="fluent-emoji:speech-balloon" width={20} /> },\n    { id: "about", label: "دەربارەی ئێمە", icon: <Icon icon="solar:info-circle-bold-duotone" width={20} /> }`;

if (code.includes(targetMenu)) {
  code = code.replace(targetMenu, newMenu);
  fs.writeFileSync('src/components/Layout.tsx', code);
  console.log('patched layout');
} else {
  console.log('failed to patch layout');
}
