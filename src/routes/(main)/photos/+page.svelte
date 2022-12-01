<script context="module" lang="ts">
  import { images } from './images.json';
  export type Image = typeof images[0];
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import { isDesktopMedia } from '$lib/store';
  import { disableScroll } from '$lib/util';
  import { onMount, tick } from 'svelte';
  import ImageGrid, { findRef } from './ImageGrid.svelte';
  import ZoomedImage from './ZoomedImage.svelte';

  // TODO: only load thumbnail/mobile when close to the viewport
  // TODO: date-based sections, or tag-based. header with underline?

  const imageMap = new Map(images.map((x) => [x.id, x]));
  let selected: Image['id'];

  onMount(async () => {
    const hash = $page.url.hash?.slice(1);
    if (imageMap.has(hash)) {
      await tick(); // wait for ImageGrid to populate
      findRef(hash).scrollIntoView({ block: 'center' });
      selected = hash;
    }
  });

  function select(id?: Image['id']) {
    const url = new URL(document.location.href);
    url.hash = id ?? '';
    history.replaceState({}, '', url);
    selected = id;
  }
</script>

<svelte:head>
  <link
    rel="alternate"
    type="application/rss+xml"
    title="RSS"
    href="/photos/rss"
  />
</svelte:head>

<svelte:window on:keydown={(e) => e.key === 'Escape' && select()} />
<svelte:body use:disableScroll={!!selected} />

<ImageGrid {images} on:select={({ detail }) => select(detail)} />
{#if $isDesktopMedia && selected}
  <ZoomedImage
    image={imageMap.get(selected)}
    fromNode={findRef(selected)}
    on:close={() => select()}
  />
{/if}
