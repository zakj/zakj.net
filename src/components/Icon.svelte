<script lang="ts">
  import type { ImageMetadata } from 'astro';

  export let src: ImageMetadata;
  export let alt: string;

  // TODO consider whether this is actually useful
</script>

<img src={src.src} width={src.width} height={src.height} {alt} />
