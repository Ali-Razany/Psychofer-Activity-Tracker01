const fs = require('fs');
let code = fs.readFileSync('src/components/ChromaGrid.tsx', 'utf8');

code = code.replace(
  "const distance = useTransform([mouseX, mouseY], ([x, y]) => {",
  "const distance = useTransform([mouseX, mouseY], ([x, y]: any[]) => {"
);

code = code.replace(
  "const ChromaGridItemCard = ({ item, mouseX, mouseY, radius = 300 }: { item: ChromaGridItem, mouseX: any, mouseY: any, radius?: number }) => {",
  "const ChromaGridItemCard: React.FC<{ item: ChromaGridItem, mouseX: any, mouseY: any, radius?: number }> = ({ item, mouseX, mouseY, radius = 300 }) => {"
);

fs.writeFileSync('src/components/ChromaGrid.tsx', code);
