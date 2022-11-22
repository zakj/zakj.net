import { prerendering } from '$app/environment';
import RSS from 'rss';
import { images } from '../images.json';
import type { RequestHandler } from './$types';

export const prerender = true;

// https://github.com/dylang/node-rss
export const GET: RequestHandler = async ({ url }) => {
  const origin = prerendering ? 'https://zakj.net' : url.origin;
  const feed = new RSS({
    title: 'zakj.net/photos',
    feed_url: origin + '/photos/rss',
    site_url: origin + '/photos',
    image_url: origin + '/img/favicon.svg', // TODO: spec requires gif/jpeg/png here
    pubDate: new Date(),
    ttl: 60 * 4,
  });

  images.forEach((img) =>
    feed.item({
      title: 'Photo', // TODO
      description: render(origin, img),
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
