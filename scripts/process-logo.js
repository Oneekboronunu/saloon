const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = 'C:/Users/JM/.gemini/antigravity/brain/619624b5-8ee2-4c7f-a1cf-0a6cfc8277be/.user_uploaded/media_1793209406507_f23bf7a5.jpg';

async function processLogo() {
  console.log('Loading input image...');
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  console.log('Metadata:', metadata.width, 'x', metadata.height, metadata.channels);

  // Get raw RGBA buffer
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 4 (RGBA)

  // Output buffer
  const outputData = Buffer.from(data);

  // Analyze corner/background color
  let cornerR = 0, cornerG = 0, cornerB = 0;
  for (let i = 0; i < 100; i++) {
    cornerR += data[i * 4];
    cornerG += data[i * 4 + 1];
    cornerB += data[i * 4 + 2];
  }
  cornerR /= 100; cornerG /= 100; cornerB /= 100;
  console.log('Corner sample:', cornerR, cornerG, cornerB);

  // Thresholds for smooth anti-aliased cutout
  const blackCutoff = 18;    // fully transparent below this
  const solidThreshold = 45; // fully opaque above this

  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Perceived luminance / max channel
    const maxVal = Math.max(r, g, b);

    if (maxVal <= blackCutoff) {
      outputData[i + 3] = 0; // fully transparent
    } else if (maxVal >= solidThreshold) {
      outputData[i + 3] = 255; // solid
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    } else {
      // Smooth gradient alpha transition to prevent jagged edges
      const factor = (maxVal - blackCutoff) / (solidThreshold - blackCutoff);
      const alpha = Math.round(factor * 255);
      outputData[i + 3] = alpha;

      // Color un-multiplication / brightness recovery for semi-transparent edges
      // Recover the true gold tone without dark background contamination
      outputData[i] = Math.min(255, Math.round(r / Math.max(0.15, factor)));
      outputData[i + 1] = Math.min(255, Math.round(g / Math.max(0.15, factor)));
      outputData[i + 2] = Math.min(255, Math.round(b / Math.max(0.15, factor)));

      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  console.log(`Bounding box of logo: (${minX}, ${minY}) to (${maxX}, ${maxY}), size: ${maxX - minX}x${maxY - minY}`);

  // Add 4% padding around the bounding box
  const pad = Math.round((maxX - minX) * 0.04);
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropWidth = Math.min(width - cropLeft, (maxX - minX) + pad * 2);
  const cropHeight = Math.min(height - cropTop, (maxY - minY) + pad * 2);

  // Save full transparent logo (uncropped)
  await sharp(outputData, { raw: { width, height, channels: 4 } })
    .png()
    .toFile('public/images/logo-full.png');

  // Save tightly cropped transparent logo (high-res)
  const cropped = sharp(outputData, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight });

  // 1. Master High-Resolution Transparent Logo (PNG & WebP)
  await cropped
    .clone()
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100 })
    .toFile('public/images/logo.png');

  await cropped
    .clone()
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 95 })
    .toFile('public/images/logo.webp');

  // 2. Navbar / Header Logo (horizontal / compact size)
  await cropped
    .clone()
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/images/logo-nav.png');

  // 3. Favicon & App Icons
  await cropped
    .clone()
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/icon.png');

  await cropped
    .clone()
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/apple-icon.png');

  await cropped
    .clone()
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/favicon-64.png');

  await cropped
    .clone()
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/favicon.png');

  // Also in src/app/icon.png for Next.js 14 App Router Metadata API
  await cropped
    .clone()
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('src/app/icon.png');

  // Also in public/icon.svg (wrapping the base64 transparent PNG in SVG for vector scalers)
  const base64Png = (await cropped.clone().resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()).toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${base64Png}" width="512" height="512" />
</svg>`;
  fs.writeFileSync('public/icon.svg', svgContent, 'utf-8');

  console.log('All logo assets successfully generated!');
}

processLogo().catch(console.error);
