import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateFavicons() {
  const srcSquircle = 'public/Productasset/Logoicon.png';

  console.log('Generating multi-resolution ICO buffers...');
  const icoSizes = [16, 32, 48, 64, 128, 256];
  const pngBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(srcSquircle).resize(s, s).png().toBuffer();
    pngBuffers.push({ size: s, buffer: buf });
  }

  // Build standard multi-resolution ICO file
  const numImages = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  let offset = 6 + numImages * 16;
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 0); // width (0 for 256)
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += item.buffer.length;
  }

  const icoBuf = Buffer.concat([header, ...dirEntries, ...pngBuffers.map(b => b.buffer)]);

  // Generate 512x512 and 180x180 PNGs
  const png512 = await sharp(srcSquircle).resize(512, 512).png().toBuffer();
  const apple180 = await sharp(srcSquircle).resize(180, 180).png().toBuffer();

  console.log('Writing favicon assets to Villa-web...');
  fs.writeFileSync('app/favicon.ico', icoBuf);
  fs.writeFileSync('public/favicon.ico', icoBuf);
  fs.writeFileSync('app/icon.png', png512);
  fs.writeFileSync('public/icon.png', png512);
  fs.writeFileSync('app/apple-icon.png', apple180);
  fs.writeFileSync('public/apple-touch-icon.png', apple180);

  console.log('Writing favicon assets to Villa-admin...');
  const adminAppDir = '../Villa-admin/app';
  const adminPublicDir = '../Villa-admin/public';

  fs.writeFileSync(path.join(adminAppDir, 'favicon.ico'), icoBuf);
  fs.writeFileSync(path.join(adminPublicDir, 'favicon.ico'), icoBuf);
  fs.writeFileSync(path.join(adminAppDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(adminPublicDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(adminAppDir, 'apple-icon.png'), apple180);
  fs.writeFileSync(path.join(adminPublicDir, 'apple-touch-icon.png'), apple180);

  console.log('✓ All favicons and touch icons generated successfully!');
}

generateFavicons().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
