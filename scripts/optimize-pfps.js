const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const pfps = [
  'vivek.png',
  'umair.png',
  'konny.png',
  'martin.png',
  'sachanh.png',
  'henry.png',
  'pranav.png',
  'marc.png',
  'bishopi.png',
  'navi.png',
  'manish.png',
  'alber_new.png',
  'yaser.png',
  'Udayan.png',
  'Vishal.png',
  'jacob.png'
];

const publicDir = path.join(__dirname, '../public');

async function optimize() {
  for (const pfp of pfps) {
    const inputPath = path.join(publicDir, pfp);
    const outputPath = path.join(publicDir, pfp.replace(/\.(png|jpg|jpeg)$/, '.webp'));
    
    if (fs.existsSync(inputPath)) {
      console.log(`Optimizing ${pfp}...`);
      await sharp(inputPath)
        .resize(128, 128, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const oldSize = fs.statSync(inputPath).size / 1024;
      const newSize = fs.statSync(outputPath).size / 1024;
      console.log(`  Done: ${oldSize.toFixed(2)}KB -> ${newSize.toFixed(2)}KB`);
    } else {
      console.warn(`  Warning: ${pfp} not found in public/`);
    }
  }
}

optimize().catch(console.error);
