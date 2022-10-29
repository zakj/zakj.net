<script lang="ts">
  import ImageGrid from './ImageGrid.svelte';
  import { images } from './images.json';
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
