import crypto from 'crypto';
import exifReader from 'exif-reader';
import fs from 'fs';
import Listr from 'listr';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREFIX = '/img/photos';
const OUTPUT_DIR = path.resolve(__dirname, `../static${PREFIX}`);
const JSON_FILE = path.resolve(
  __dirname,
  '../src/routes/(main)/photos/images.json'
);

const imageMap = fs.existsSync(JSON_FILE)
  ? new Map(
      JSON.parse(fs.readFileSync(JSON_FILE)).images.map((x) => [x.md5, x])
    )
  : new Map();

function md5File(path) {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('md5');
    const input = fs.createReadStream(path);
    output.once('readable', () => resolve(output.read().toString('hex')));
    input.pipe(output);
    input.on('error', reject);
  });
}

const seenIds = new Set();
function uniqueId(id) {
  let len = 8;
  while (seenIds.has(id.slice(0, len))) ++len;
  const uid = id.slice(0, len);
  seenIds.add(uid);
  return uid;
}

async function processImage(filename) {
  const md5 = await md5File(filename);
  if (imageMap.has(md5)) return imageMap.get(md5);
  const id = uniqueId(md5);
  const fullFilename = `${id}.webp`;
  const mobileFilename = `${id}-m.webp`;
  const thumbFilename = `${id}-t.webp`;
  const img = sharp(filename)
    .withMetadata({
      exif: { IFD0: { Copyright: 'Zak Johnson <me@zakj.net>' } },
    })
    .rotate() // automatically reorient based on EXIF data
    .webp({ effort: 6 });

  const exif = exifReader((await img.metadata()).exif);

  let date = exif.exif.DateTimeOriginal;
  if (!date) throw new Error('exif missing date: ' + JSON.stringify(exif.exif));

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
    id,
    md5,
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
  return imageData.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function main() {
  if (process.argv.length < 3) {
    console.error(`usage: ${process.argv[1]} <path to image dir>`);
    process.exit(1);
  }

  const images = await processImageDir(process.argv[2]);
  const files = new Set(
    images
      .flatMap((x) => [x.full.src, x.mobile.src, x.thumb.src])
      .map((f) => f.split('/').pop())
  );

  fs.writeFileSync(
    path.resolve(__dirname, JSON_FILE),
    JSON.stringify({ images })
  );

  for (const file of fs.readdirSync(OUTPUT_DIR)) {
    if (/^\./.test(file) || files.has(file)) continue;
    fs.rmSync(path.resolve(OUTPUT_DIR, file));
    console.log('removed stale', file);
  }
}

await main();
