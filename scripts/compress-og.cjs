const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, '..', 'public', 'og-image.jpg');
const output = path.join(__dirname, '..', 'public', 'og-image.webp');

sharp(input)
  .resize(1200, 630, {
    fit: 'cover',
    position: 'center'
  })
  .webp({ quality: 80 })
  .toFile(output)
  .then(() => {
    const fs = require('fs');
    const stats = fs.statSync(output);
    console.log(`✅ Created og-image.webp: ${(stats.size / 1024).toFixed(0)}KB`);
  })
  .catch(console.error);