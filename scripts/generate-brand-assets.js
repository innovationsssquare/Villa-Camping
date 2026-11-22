import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const uploads = {
  blackIcon: 'C:/Users/santo/.gemini/antigravity/brain/708c4c6c-b694-4559-ab5f-5ba0f764ddc5/.user_uploaded/media_1795350933967_ca1f1e92.png',
  whiteIcon: 'C:/Users/santo/.gemini/antigravity/brain/708c4c6c-b694-4559-ab5f-5ba0f764ddc5/.user_uploaded/media_1795350933963_6ad57f45.png',
  whiteSquircle: 'C:/Users/santo/.gemini/antigravity/brain/708c4c6c-b694-4559-ab5f-5ba0f764ddc5/.user_uploaded/media_1795350933905_316e3d66.png',
  blackSquircle: 'C:/Users/santo/.gemini/antigravity/brain/708c4c6c-b694-4559-ab5f-5ba0f764ddc5/.user_uploaded/media_1795350933905_c5e213cb.png',
};

async function main() {
  console.log('Generating brand assets from uploaded new logo...');

  // 1. Trim black and white icons
  const trimBlack = await sharp(uploads.blackIcon).trim().resize({ height: 450 }).toBuffer();
  const blackMeta = await sharp(trimBlack).metadata();

  const trimWhite = await sharp(uploads.whiteIcon).trim().resize({ height: 450 }).toBuffer();
  const whiteMeta = await sharp(trimWhite).metadata();

  // 2. Prepare text parts
  const trimText = await sharp('text_part.png').trim().toBuffer();
  const textMeta = await sharp(trimText).metadata();

  // Inverted white text
  const { data: textData, info: textInfo } = await sharp(trimText).raw().toBuffer({ resolveWithObject: true });
  const whiteTextData = Buffer.from(textData);
  for (let i = 0; i < whiteTextData.length; i += 4) {
    whiteTextData[i] = 255;
    whiteTextData[i+1] = 255;
    whiteTextData[i+2] = 255;
  }
  const trimWhiteText = await sharp(whiteTextData, {
    raw: { width: textInfo.width, height: textInfo.height, channels: 4 }
  }).png().toBuffer();

  // Horizontal canvas layout: 2472 x 520
  const canvasW = 2472, canvasH = 520;
  const iconLeft = 40;
  const iconTop = Math.round((canvasH - 450) / 2);
  const gap = 85;
  const textLeft = iconLeft + blackMeta.width + gap;
  const textTop = Math.round((canvasH - textMeta.height) / 2) + 10;

  // A. Horizontal Logo Light (Black mark + Black text on transparent)
  const logoLightBuf = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([
    { input: trimBlack, left: iconLeft, top: iconTop },
    { input: trimText, left: textLeft, top: textTop }
  ]).png().toBuffer();

  // B. Horizontal Logo Dark / Invert (White mark + White text on transparent)
  const logoDarkBuf = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([
    { input: trimWhite, left: iconLeft, top: iconTop },
    { input: trimWhiteText, left: textLeft, top: textTop }
  ]).png().toBuffer();

  // C. 1024x1024 High-Res Black Squircle with White Logo inside (App Icon)
  const size = 1024;
  const radius = 224;
  const squircleSvg = Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#0a0a0a"/>` +
    `</svg>`
  );
  const whiteMarkForSquircle = await sharp(uploads.whiteIcon).trim().resize({ width: 620 }).toBuffer();
  const squircleMeta = await sharp(whiteMarkForSquircle).metadata();
  const sqLeft = Math.round((size - squircleMeta.width) / 2);
  const sqTop = Math.round((size - squircleMeta.height) / 2);

  const squircleAppIconBuf = await sharp(squircleSvg)
    .composite([{ input: whiteMarkForSquircle, left: sqLeft, top: sqTop }])
    .png()
    .toBuffer();

  // D. 1024x1024 Transparent Black Mark
  const transparentBlackMark1024 = await sharp(uploads.blackIcon)
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // E. 1024x1024 Transparent White Mark
  const transparentWhiteMark1024 = await sharp(uploads.whiteIcon)
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // F. 500x500 Transparent Black Mark
  const transparentBlackMark500 = await sharp(uploads.blackIcon)
    .resize(500, 500, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // G. 500x500 Transparent White Mark
  const transparentWhiteMark500 = await sharp(uploads.whiteIcon)
    .resize(500, 500, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // High-Res (2976 x 1434) Centered Horizontal Logo
  const highResMainLogo = await sharp({
    create: {
      width: 2976,
      height: 1434,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([
    {
      input: await sharp(logoLightBuf).resize(2600).toBuffer(),
      gravity: 'centre'
    }
  ]).png().toBuffer();

  console.log('Writing assets to Villa-web...');
  // Villa-web assets
  fs.writeFileSync('public/Productasset/mainlogo_clean.png', logoLightBuf);
  fs.writeFileSync('public/Productasset/mainlogo_clean_dark.png', logoDarkBuf);
  fs.writeFileSync('public/Productasset/mainlogo.png', highResMainLogo);
  fs.writeFileSync('public/Productasset/Logoicon.png', squircleAppIconBuf);
  fs.writeFileSync('public/Productasset/Logo2.png', transparentBlackMark500);
  fs.writeFileSync('public/Productasset/Logo2_dark.png', transparentWhiteMark500);
  fs.writeFileSync('public/Loginasset/Logo.png', transparentBlackMark1024);
  fs.writeFileSync('public/Loginasset/Logo2.png', transparentWhiteMark1024);

  console.log('Writing assets to Villa-admin...');
  const adminAssetDir = '../Villa-admin/public/Asset';
  const adminLoginDir = '../Villa-admin/public/Loginasset';

  fs.writeFileSync(path.join(adminAssetDir, 'applogo.png'), logoLightBuf);
  fs.writeFileSync(path.join(adminAssetDir, 'applogodark.png'), logoDarkBuf);
  fs.writeFileSync(path.join(adminAssetDir, 'icon.png'), squircleAppIconBuf);
  fs.writeFileSync(path.join(adminAssetDir, 'Logo.png'), transparentBlackMark500);
  fs.writeFileSync(path.join(adminAssetDir, 'Logo2.png'), logoLightBuf);
  fs.writeFileSync(path.join(adminLoginDir, 'Logo.png'), transparentBlackMark500);

  console.log('✓ All brand logo assets generated and replaced successfully!');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
