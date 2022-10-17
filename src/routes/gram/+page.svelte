<script lang="ts">
  // TODO: figure out how to store all these big images
  import images from '$lib/gram-data';
  import ImageGrid from './ImageGrid.svelte';
</script>

<div>
  <ImageGrid {images} />
</div>

<style>
  div {
    margin: 0 auto;
    /* max-width: 900px; */
    padding-bottom: 3em;
    padding-left: 5em;
    padding-right: 5em;
  }
</style>
