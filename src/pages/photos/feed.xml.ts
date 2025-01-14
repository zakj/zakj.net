import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const photos = await getCollection('photos');
  return rss({
    title: 'Photos · zakj.net',
    description: "Zak's local Instagram.",
    site: context.site ?? 'https://zakj.net/',
    customData: '<language>en-us</language>',
    items: photos.map(({ data }) => ({
      pubDate: data.date,
      link: `/photos/${data.id}`,
      content: `<img src="${data.thumb.src}" width="${data.thumb.width}" height="${data.thumb.height}">`,
    })),
  });
}
