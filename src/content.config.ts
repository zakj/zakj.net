import { defineCollection, z } from 'astro:content';
import ImageKit from 'imagekit';
import type { FileObject, Transformation } from 'imagekit/dist/libs/interfaces';
import smartcrop from 'smartcrop-sharp';
import { IK_ENDPOINT, IK_PUBLIC_KEY, IK_PRIVATE_KEY } from 'astro:env/server';

// TODO .env loading is broken in Astro 5.1.3 through at least 5.1.5; hopefully fixed in next
// https://github.com/withastro/astro/issues/12952

/*
TODO could we reduce the amount of css silliness now that we have access to easier resizing?
rows are 250px high
images are either 3x2 or 2x3 aspect ratio
so each image is max 250px high, max 375px width
for taller aspect ratio images, should be 250px high by ~167px width
can use conditional transformations based on ar
*/

function arrayOrItem(xs: unknown): string[] {
  return Array.isArray(xs) ? xs : xs ? [xs] : [];
}

async function imagekitLoader() {
  const ik = new ImageKit({
    publicKey: IK_PUBLIC_KEY,
    privateKey: IK_PRIVATE_KEY,
    urlEndpoint: IK_ENDPOINT,
  });

  const files = await ik.listFiles({
    type: 'file',
    fileType: 'image',
    path: 'photos',
  });

  function url(
    file: FileObject,
    transformation: Transformation | Transformation[] = [],
  ): string {
    if (!Array.isArray(transformation)) transformation = [transformation];
    return ik.url({ path: file.filePath, transformation });
  }

  async function fetchBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url);
    return Buffer.from(await response.arrayBuffer());
  }

  return await Promise.all(
    files.map(async (file) => {
      if (file.type !== 'file' || file.fileType !== 'image') throw new Error();

      const placeholderData = await fetchBuffer(
        url(file, { height: 16, effectContrast: true, format: 'webp' }),
      );

      const cropSize = 500;
      const buffer = await fetchBuffer(
        url(file, { height: cropSize, width: cropSize, crop: 'at_least' }),
      );
      const topCrop = (
        await smartcrop.crop(buffer, { height: cropSize, width: cropSize })
      ).topCrop;
      const pct = (a: number, b: number): string =>
        `${Math.round((a / b) * 100)}%`;
      const crop = [
        pct(topCrop.x, topCrop.width),
        pct(topCrop.y, topCrop.height),
      ].join(' ');

      const exif = file.embeddedMetadata;
      const tags = [
        ...arrayOrItem(exif?.Keywords),
        ...arrayOrItem(exif?.PersonInImage),
        ...arrayOrItem(file.tags),
      ]
        .map((t) => t.toLowerCase())
        .filter((t) => !['gram', '4 star', 'photo stream'].includes(t));

      return {
        id: file.fileId,
        date: new Date(
          (file.embeddedMetadata?.DateTimeOriginal as string) ?? file.createdAt,
        ),
        width: file.width,
        height: file.height,
        tags,
        desc: file.customMetadata?.desc,
        alt: file.customMetadata?.alt,
        placeholder: `data:image/webp;base64,${placeholderData.toString('base64')}`,
        full: {
          src: url(file),
          height: file.height,
          width: file.width,
        },
        thumb: {
          src: url(file, { height: 500 }),
          height: 500,
          width: Math.floor(500 * (file.width / file.height)),
        },
        crop,
      };
    }),
  );
}

export const collections = {
  photos: defineCollection({
    loader: imagekitLoader,
    schema: z.object({
      id: z.string(),
      date: z.date().min(new Date('1980-01-01')).max(new Date()),
      width: z.number().positive().int(),
      height: z.number().positive().int(),
      tags: z.string().array(),
      desc: z.string().optional(),
      alt: z.string().optional(),
      placeholder: z.string(),
      full: z.object({
        src: z.string().url(),
        width: z.number().positive().int(),
        height: z.number().positive().int(),
      }),
      thumb: z.object({
        src: z.string().url(),
        width: z.number().positive().int(),
        height: z.number().positive().int(),
      }),
      crop: z.string(),
    }),
  }),
};
