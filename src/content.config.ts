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

      // The square crop closest to centered on the focal point, as object-position
      // percentages, which are a share of the overflow, not of the image.
      const side = Math.min(file.width!, file.height!);
      const pct = (f: number, size: number): string => {
        if (size === side) return '50%';
        const offset = (f * size - side / 2) / (size - side);
        return `${Math.round(Math.min(1, Math.max(0, offset)) * 100)}%`;
      };
      const crop = [pct(focal.x, file.width!), pct(focal.y, file.height!)].join(
        ' ',
      );

      const thumbs = [500, 1000, 1500].map((height) => ({
        src: url(file, { height }),
        height,
        width: Math.floor(height * (file.width! / file.height!)),
      }));

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
        focus: file.customCoordinates ? 'custom' : 'auto',
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
        crop,
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
      focus: z.enum(['custom', 'auto']),
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
      crop: z.string(),
      focal: z.object({
        x: z.number().min(0).max(1),
        y: z.number().min(0).max(1),
      }),
    }),
  }),
};
