import { defineCollection, z } from 'astro:content';
import ImageKit from '@imagekit/nodejs';
import type { File, Transformation } from '@imagekit/nodejs/resources';
import smartcrop from 'smartcrop-sharp';
import { IK_ENDPOINT, IK_PRIVATE_KEY } from 'astro:env/server';

/*
TODO could we reduce the amount of css silliness now that we have access to easier resizing?
rows are 250px high
images are either 3x2 or 2x3 aspect ratio
so each image is max 250px high, max 375px width
for taller aspect ratio images, should be 250px high by ~167px width
can use conditional transformations based on ar
*/

function arrayOrItem(xs: unknown): string[] {
  if (Array.isArray(xs)) return xs;
  if (typeof xs === 'string') return [xs];
  if (xs == null) return [];
  throw new Error(`Unexpected type ${typeof xs}`);
}

async function imagekitLoader() {
  const ik = new ImageKit({ privateKey: IK_PRIVATE_KEY });

  const files = await ik.assets.list({
    type: 'file',
    fileType: 'image',
    path: 'photos',
  });

  // urlEndpoint: IK_ENDPOINT,
  function url(
    file: File,
    transformation: Transformation | Transformation[] = [],
  ): string {
    if (!Array.isArray(transformation)) transformation = [transformation];
    return ik.helper.buildSrc({
      urlEndpoint: IK_ENDPOINT,
      src: file.filePath!,
      transformation,
    });
  }

  async function fetchBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url);
    return Buffer.from(await response.arrayBuffer());
  }

  return await Promise.all(
    files.map(async (file) => {
      if (file.type !== 'file' || file.fileType !== 'image') throw new Error();

      async function smartFocal(): Promise<{ x: number; y: number }> {
        const cropSize = 500;
        const buffer = await fetchBuffer(
          url(file, { height: cropSize, width: cropSize, crop: 'at_least' }),
        );
        const { topCrop } = await smartcrop.crop(buffer, {
          height: cropSize,
          width: cropSize,
        });
        const scale = cropSize / Math.min(file.width!, file.height!);
        return {
          x: (topCrop.x + topCrop.width / 2) / (file.width! * scale),
          y: (topCrop.y + topCrop.height / 2) / (file.height! * scale),
        };
      }

      // A focus rectangle set by hand in ImageKit wins over smartcrop's guess.
      const custom = file.customCoordinates?.split(',').map(Number);
      const [placeholderData, focal] = await Promise.all([
        fetchBuffer(
          url(file, { height: 16, contrastStretch: true, format: 'webp' }),
        ),
        custom
          ? {
              x: (custom[0] + custom[2] / 2) / file.width!,
              y: (custom[1] + custom[3] / 2) / file.height!,
            }
          : smartFocal(),
      ]);

      const thumbs = [500, 1000, 1500].map((height) => ({
        src: url(file, { height }),
        height,
        width: Math.floor(height * (file.width! / file.height!)),
      }));

      // The share card: scaled to cover, then cut out around the focal point, kept
      // inside the photo.
      const card = { width: 1200, height: 630 };
      const cardScale = Math.max(
        card.width / file.width!,
        card.height / file.height!,
      );
      const cardOffset = (f: number, size: number, cardSize: number) =>
        Math.max(
          0,
          Math.floor(
            Math.min(
              f * size * cardScale - cardSize / 2,
              size * cardScale - cardSize,
            ),
          ),
        );
      const og = url(file, [
        { ...card, crop: 'at_least' },
        {
          ...card,
          cropMode: 'extract',
          x: cardOffset(focal.x, file.width!, card.width),
          y: cardOffset(focal.y, file.height!, card.height),
        },
      ]);

      // @ts-expect-error: embeddedMetadata exists in the response but isn't documented in the SDK.
      const exif = file.embeddedMetadata;
      const tags = [
        ...arrayOrItem(exif?.Keywords),
        ...arrayOrItem(exif?.PersonInImage),
        ...arrayOrItem(file.tags),
      ]
        .map((t) => t.toLowerCase())
        .filter((t) => !['gram', '4 star', 'photo stream'].includes(t));

      return {
        id: file.fileId!,
        path: file.filePath,
        date: new Date((exif?.DateTimeOriginal as string) ?? file.createdAt),
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
          ...thumbs[0],
          srcset: thumbs.map((t) => `${t.src} ${t.width}w`).join(', '),
        },
        og,
        focal,
      };
    }),
  );
}

export const collections = {
  photos: defineCollection({
    loader: imagekitLoader,
    schema: z.object({
      id: z.string(),
      path: z.string(),
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
        srcset: z.string(),
      }),
      og: z.string().url(),
      focal: z.object({
        x: z.number().min(0).max(1),
        y: z.number().min(0).max(1),
      }),
    }),
  }),
};
