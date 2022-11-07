import crypto from 'crypto';
import exifReader from 'exif-reader';
import fs from 'fs';
import Listr from 'listr';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREFIX = '/img/gram';
const OUTPUT_DIR = path.resolve(__dirname, `static${PREFIX}`);
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');

async function processImage(filename) {
  const md5sum = md5(filename);
  const fullFilename = `${md5sum}.webp`;
  const mobileFilename = `${md5sum}-m.webp`;
  const thumbFilename = `${md5sum}-t.webp`;
  const img = sharp(filename)
    .withMetadata({
      exif: { IFD0: { Copyright: 'Zak Johnson <me@zakj.net>' } },
    })
    .webp({ effort: 6 });

  const exif = exifReader((await img.metadata()).exif);
  const date = exif.exif.DateTimeOriginal;
  let caption = exif.image.ImageDescription;
  if (!caption || !caption.includes('ALT: ')) {
    // TODO: enforce alt text
    // throw new Error(`missing caption or alt`);
    caption = 'ALT: ';
  }
  const [description, alt] = caption.split('ALT: ').map((x) => x.trim());

  const full = await img
    .clone()
    .resize({ width: 5000, height: 3000, fit: 'inside' })
    .toFile(path.resolve(OUTPUT_DIR, fullFilename));
  const mobile = await img
    .clone()
    .resize({ width: 1400 })
    .toFile(path.resolve(OUTPUT_DIR, mobileFilename));
  const thumb = await img
    .clone()
    .resize({ height: 500 })
    .toFile(path.resolve(OUTPUT_DIR, thumbFilename));

  const placeholderData = (
    await sharp(filename)
      .webp()
      .resize({ height: 16 })
      .modulate({ saturation: 1.2 })
      .removeAlpha()
      .normalise()
      .toBuffer()
  ).toString('base64');
  const placeholder = `data:image/webp;base64,${placeholderData}`;

  const imgData = (fn, { width, height }) => ({
    src: `${PREFIX}/${fn}`,
    width,
    height,
  });

  return {
    date,
    full: imgData(fullFilename, full),
    mobile: imgData(mobileFilename, mobile),
    thumb: imgData(thumbFilename, thumb),
    placeholder,
    description,
    alt,
  };
}

async function processImageDir(dir) {
  const imageData = [];
  const tasks = new Listr({ concurrent: 16 });
  for (const file of fs.readdirSync(dir)) {
    if (/^\./.test(file)) continue;
    tasks.add({
      title: file,
      task: (ctx, task) =>
        processImage(path.resolve(dir, file))
          .then((info) => imageData.push(info))
          .catch((e) => task.skip(e.message)),
    });
  }
  await tasks.run().catch((err) => console.error(err));
  imageData.sort((a, b) => b.date - a.date);
  return imageData;
}

fs.writeFileSync(
  path.resolve(__dirname, 'src/routes/(main)/gram/images.json'),
  JSON.stringify({ images: await processImageDir(process.argv[2]) })
);
