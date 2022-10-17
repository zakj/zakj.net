import crypto from 'crypto';
import exifReader from 'exif-reader';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREFIX = '/img/gram';
const OUTPUT_DIR = path.resolve(__dirname, `static${PREFIX}`);
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');

async function processImage(filename) {
  // console.log(filename, path.parse(filename).name);
  const md5sum = md5(filename);
  const filenameFull = `${md5sum}.webp`;
  const filenameThumb = `${md5sum}-t.webp`;
  const img = sharp(filename)
    .withMetadata({
      exif: { IFD0: { Copyright: 'Zak Johnson <me@zakj.net>' } },
    })
    .toFormat('webp');

  img.clone().toFile(path.resolve(OUTPUT_DIR, filenameFull));
  img
    .clone()
    .resize({ height: 500 })
    .toFile(path.resolve(OUTPUT_DIR, filenameThumb));

  const date = exifReader((await img.metadata()).exif).exif?.DateTimeOriginal;

  const placeholderData = (
    await sharp(filename)
      .resize({ height: 16 })
      .toFormat('webp')
      .modulate({ saturation: 1.2 })
      .removeAlpha()
      .normalise()
      .toBuffer()
  ).toString('base64');
  const placeholder = `data:image/webp;base64,${placeholderData}`;

  return {
    orig: path.basename(filename),
    src: `${PREFIX}/${filenameFull}`,
    thumb: `${PREFIX}/${filenameThumb}`,
    date,
    placeholder,
  };
}

async function processImageDir(dir) {
  const imageData = [];
  for (const file of fs.readdirSync(dir)) {
    if (/^\./.test(file)) continue;
    console.log('processing', file);
    imageData.push(await processImage(path.resolve(dir, file)));
  }
  imageData.sort((a, b) => b.date - a.date);
  return imageData;
}

fs.writeFileSync(
  path.resolve(__dirname, 'src/lib/gram-data.js'),
  'export default ' + JSON.stringify(await processImageDir(process.argv[2]))
);
