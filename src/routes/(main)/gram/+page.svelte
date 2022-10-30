<script lang="ts">
  import ImageGrid from './ImageGrid.svelte';
  import { images } from './images.json';
</script>

<!-- <h1 class:rotated on:click={() => (rotated = !rotated)}>Gram</h1> -->
<!-- TODO: on mobile, single column, don't compress, don't open on click, don't preload -->
<!-- TODO: only load full page on desktop when close to the viewport -->
<!-- TODO: date-based sections, or tag-based. header with underline? -->
<ImageGrid {images} />

<style>
  main {
    /* display: grid;

    grid-template-columns: calc(64px + 16px * 2) auto;
    margin-top: calc(var(--padding) + var(--mark-size));
    padding: var(--padding);
    place-content: center;
    translate: -48px; */
    /* grid-gap: 24px; */

    /* margin: 0 auto; */
    /* max-width: 900px; */
    /* padding-bottom: 3em;
    padding-left: 5em;
    padding-right: 5em; */
  }

  h1 {
    animation: test 800ms;
    animation-timing-function: ease;

    font-size: 88px;
    line-height: 103px;
    display: inline-block;
    position: sticky;
    top: 0;
    transform-origin: bottom left;
    transition: transform 200ms ease-in;
    z-index: 1;
  }

  h1.rotated {
    transform: translateX(-103px) rotate(90deg);
    line-height: 96px;
  }

  @keyframes test {
    0% {
      translate: -100px;
      opacity: 0;
    }
    100% {
      translate: -0px;
      opacity: 1;
    }
  }
</style>
