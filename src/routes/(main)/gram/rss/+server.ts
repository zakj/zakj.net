import RSS from 'rss';
import { images } from '../images.json';
import type { RequestHandler } from './$types';

export const prerender = true;

// https://github.com/dylang/node-rss
export const GET: RequestHandler = async ({ url }) => {
  const parentUrl = url.href.split('/').slice(0, -1).join('/');
  const feed = new RSS({
    title: 'zakj.net/photos',
    feed_url: url.href,
    site_url: parentUrl,
    image_url: `${url.origin}/img/favicon.svg`,
    managingEditor: 'Zak Johnson',
    webMaster: 'Zak Johnson',
    pubDate: new Date(),
    ttl: 60 * 4,
  });

  images.forEach((img) =>
    feed.item({
      title: 'Photo', // TODO
      description: render(url.origin, img),
      guid: img.md5,
      date: img.date,
    })
  );

  // NOTE: also set headers in netlify.toml.
  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
};

function render(baseUrl: string, img: typeof images[0]): string {
  return `
  <img
    src="${baseUrl + img.full.src}"
    width="${img.full.width}"
    height="${img.full.height}"
    alt="${img.alt}"
  />`;
}
