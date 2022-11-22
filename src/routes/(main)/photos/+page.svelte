<script lang="ts">
  import { layout } from '$lib/store';
  import ImageGrid from './ImageGrid.svelte';
  import { images } from './images.json';

  layout.set({ title: 'Photos' });

  // TODO: only load thumbnail/mobile when close to the viewport
  // TODO: date-based sections, or tag-based. header with underline?
  // TODO: url hash routing to load the page focusing a particular image?
</script>

<svelte:head>
  <link
    rel="alternate"
    type="application/rss+xml"
    title="RSS"
    href="/photos/rss"
  />
</svelte:head>

<ImageGrid {images} />
