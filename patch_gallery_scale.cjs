const fs = require('fs');
let code = fs.readFileSync('src/components/CircularGallery.jsx', 'utf8');

const targetScale = `this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;`;

const replaceScale = `this.scale = this.screen.height / 1500;
    const size = (this.viewport.height * (500 * this.scale)) / this.screen.height;
    this.plane.scale.y = size;
    this.plane.scale.x = size;`;

if (code.includes(targetScale)) {
  code = code.replace(targetScale, replaceScale);
  fs.writeFileSync('src/components/CircularGallery.jsx', code);
  console.log('patched CircularGallery scale');
} else {
  console.log('failed to find target scale');
}
