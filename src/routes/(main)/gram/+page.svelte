<script lang="ts">
  import { layout } from '$lib/store';
  import ImageGrid from './ImageGrid.svelte';
  import { images } from './images.json';

  layout.set({ title: 'Gram' });

  // TODO: only load thumbnail/mobile when close to the viewport
  // TODO: date-based sections, or tag-based. header with underline?
</script>

<ImageGrid {images} />
