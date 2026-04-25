import sharp from 'sharp';
import fs from 'fs';

async function generate() {
  const svgPath = './public/favicon.svg';
  if (!fs.existsSync(svgPath)) {
    console.error('favicon.svg not found');
    return;
  }
  
  const svgBuffer = fs.readFileSync(svgPath);

  try {
    // 48x48 PNG
    await sharp(svgBuffer)
      .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile('./public/favicon-48x48.png');
    console.log('favicon-48x48.png generated');

    // 96x96 PNG
    await sharp(svgBuffer)
      .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile('./public/favicon-96x96.png');
    console.log('favicon-96x96.png generated');
      
    // 192x192 PNG
    await sharp(svgBuffer)
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile('./public/favicon-192x192.png');
    console.log('favicon-192x192.png generated');

    // Apple Touch Icon 180x180 PNG
    // For apple touch icons, it's recommended to have a solid background or just alpha if supported,
    // we'll leave it alpha and apple device will put white or black usually, but white is safer.
    // Let's use it as is.
    await sharp(svgBuffer)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toFile('./public/apple-touch-icon.png');
    console.log('apple-touch-icon.png generated');
    
    // Copy 48x48 to favicon.ico (not standard ICO, but many browsers accept it as fallback)
    // A real ICO needs extra conversion, index.html will use the pngs mostly for search engines.
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generate();
