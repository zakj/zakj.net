<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import ImageGrid from './ImageGrid.svelte';
  import { images } from './images.json';

  // TODO: only load thumbnail/mobile when close to the viewport
  // TODO: date-based sections, or tag-based. header with underline?

  let selected: string;
  onMount(() => (selected = $page.url.hash?.slice(1)));

  function handleSelect({ detail: id }: CustomEvent) {
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

<ImageGrid {images} {selected} on:select={handleSelect} />
