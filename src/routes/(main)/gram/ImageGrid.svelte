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

  let zoom: Image & {
    from: Element;
    url: string;
    fullImageLoaded: Promise<string>;
  };
  function zoomIn(image: Image, el: HTMLDivElement) {
    const loaded = new Promise<string>((resolve) => {
      const img = new Image();
      img.src = image.src;
      img.addEventListener('load', () => resolve(image.src));
    });
    zoom = {
      ...image,
      from: el,
      url: image.thumb,
      fullImageLoaded: loaded,
    };
    document.body.classList.add('no-scroll');
  }
  function zoomOut(e) {
    zoom = null;
    // HACK: why doesn't unsetting zoom work here?
    e.currentTarget.classList.remove('show');
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
      duration: 350,
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

  async function swapFullImageWhenLoaded() {
    const src = await zoom.fullImageLoaded;
    // HACK: requestAnimationFrame doesn't always work; Safari makes a choppy transition.
    setTimeout(() => (zoom.url = src), 20);
    // requestAnimationFrame(() => (zoom.url = src));
  }
</script>

<div class="grid">
  {#each images as img}
    <div
      class="img-container"
      tabindex="0"
      role="button"
      on:click={(e) => zoomIn(img, e.currentTarget)}
      on:keydown={(e) => e.key === 'Enter' && zoomIn(img, e.currentTarget)}
    >
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
  <div class="zoom" class:show={zoom} on:click={zoomOut} on:keydown={zoomOut}>
    <figure
      transition:zoomFromElement={zoom.from}
      on:introend={swapFullImageWhenLoaded}
      style:aspect-ratio={zoom.size.width / zoom.size.height}
      style:background-image={`url(${zoom.url})`}
    >
      <!-- TODO {zoom.description || ''} -->
    </figure>
  </div>
{/if}

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
    padding: var(--padding);
    position: fixed;
    top: 0;
    width: 100vw;

    -webkit-backdrop-filter: blur(0px);
    backdrop-filter: blur(0px);
    transition: all 250ms ease-in;
  }
  .zoom.show {
    -webkit-backdrop-filter: blur(7px);
    backdrop-filter: blur(7px);
  }

  .zoom figure {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
      0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
      0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
    max-height: calc(100vh - var(--padding) * 2);
    max-width: calc(100vw - var(--padding) * 2);
    user-select: none; /* because I keep double-clicking these things */

    /* HACK: flex/grid on parent doesn't work with auto-sizing. */
    margin: 0 auto;
    position: relative;
    top: 50%;
    translate: 0 -50%;
  }

  :global(body.no-scroll) {
    overflow: hidden;
  }
</style>
