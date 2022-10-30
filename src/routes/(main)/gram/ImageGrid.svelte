<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import type { TransitionConfig } from 'svelte/transition';

  type Size = { width: number; height: number };
  type Image = {
    src: string;
    size: Size;
    thumb: string;
    thumbSize: Size;
    placeholder: string;
    description: string;
    alt: string;
  };
  export let images: Image[];

  // TODO: preload doesn't always work. pre-fill zoom element on hover?
  let zoom: Image & { from: Element };
  function zoomIn(image: Image, el: HTMLDivElement) {
    zoom = { ...image, from: el };
    document.body.classList.add('no-scroll');
  }
  function zoomOut() {
    zoom = null;
    document.body.classList.remove('no-scroll');
  }

  // Stolen from https://github.com/sveltejs/svelte/blob/master/src/runtime/transition/index.ts
  function zoomFromElement(node: Element, fromNode: Element): TransitionConfig {
    const from = fromNode.getBoundingClientRect();
    const to = node.getBoundingClientRect();

    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const dw = from.width / to.width;
    const dh = from.height / to.height;

    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;
    const opacity = +style.opacity;

    return {
      duration: 250,
      easing: cubicOut,
      css: (t, u) => `
        opacity: ${t * opacity};
        transform-origin: top left;
        transform: ${transform}
          translate(${u * dx}px, ${u * dy}px)
          scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
      `,
    };
  }
</script>

<div class="grid">
  {#each images as img}
    <div class="img-container" on:click={(e) => zoomIn(img, e.currentTarget)}>
      <img
        class="placeholder"
        src={img.placeholder}
        height="100%"
        aria-hidden="true"
        alt=""
      />
      <img
        class="thumb"
        src={img.thumb}
        width={img.thumbSize.width}
        height={img.thumbSize.height}
        alt={img.alt}
      />
    </div>
  {/each}
</div>
{#if zoom}
  <div class="zoom" on:click={zoomOut}>
    <figure transition:zoomFromElement={zoom.from}>
      <img
        src={zoom.src}
        width={zoom.size.width}
        height={zoom.size.height}
        alt={zoom.alt}
      />
      <!-- {zoom.description || ''} -->
    </figure>
  </div>
{/if}

{#each images as img}
  <link rel="preload" as="image" href={img.src} />
{/each}

<style>
  .grid {
    display: flex;
    flex-wrap: wrap;
  }

  .grid .img-container {
    display: flex;
    flex: auto;
    height: 250px;
    margin: 2px;
    overflow: hidden;
    place-items: center;
    position: relative;
  }

  /* TODO: select the right number of last children based on vw */
  .grid .img-container:nth-last-child(-n + 2) {
    max-width: 450px;
  }

  .grid img {
    flex: auto;
    height: 100%;
    object-fit: cover;
  }

  .grid img.placeholder {
    filter: blur(10px);
  }

  .grid img.thumb {
    position: absolute;
    width: 100%;
  }

  .zoom {
    cursor: zoom-out;
    display: block;
    height: 100vh;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;

    display: grid;
    place-content: center;
    padding: var(--padding);
  }

  .zoom figure {
    display: flex;
    flex-direction: column;
    user-select: none; /* because I keep double-clicking these things */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
      0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
      0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
  }

  .zoom img {
    max-height: calc(100vh - var(--padding) * 2);
    max-width: calc(100vw - var(--padding) * 2);
    height: auto;
    width: auto;
  }

  :global(body.no-scroll) {
    overflow: hidden;
  }
</style>
