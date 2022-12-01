<script lang="ts">
  import { zoomFromElement } from '$lib/util';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { Image } from './+page.svelte';

  export let image: Image;
  export let fromNode: Element;

  let loaded = false;
  let animated = false;
  let done = false;
  $: done = loaded && animated;

  const dispatch = createEventDispatcher();
  const close = () => dispatch('close');

  $: if (image) {
    animated = false;
    loaded = false;
    new Promise<void>((resolve) => {
      const img = new Image();
      img.src = image.full.src;
      img.addEventListener('load', () => (loaded = true));
    });
  }
</script>

<div on:click={close} on:keydown={close}>
  <!-- TODO next/prev on left/right arrow -->
  <div class="backdrop" transition:fade />
  <figure
    transition:zoomFromElement={fromNode}
    on:introend={() => (animated = true)}
    style:aspect-ratio={image.full.width / image.full.height}
    style:background-image={`${done ? `url(${image.full.src}),` : ''}
      url(${image.thumb.src})`}
  >
    <!-- TODO {image.description || ''} -->
  </figure>
</div>

<style>
  @media screen and (min-width: 750px) {
    div {
      cursor: zoom-out;
      display: block;
      height: 100vh;
      left: 0;
      padding: var(--padding);
      position: fixed;
      top: 0;
      width: 100vw;
      z-index: 1;
    }

    .backdrop {
      -webkit-backdrop-filter: blur(7px);
      backdrop-filter: blur(7px);
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 0;
    }

    figure {
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
        0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
        0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
      max-height: calc(100vh - var(--padding) * 2);
      max-width: calc(100vw - var(--padding) * 2);
      user-select: none; /* because I keep double-clicking these things */

      /* HACK: flex/grid on parent doesn't seem to work with auto-sizing. */
      margin: 0 auto;
      position: relative;
      top: 50%;
      translate: 0 -50%;
    }
  }
</style>
