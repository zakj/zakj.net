<script lang="ts">
  import { disableScroll } from '$lib/util';
  import { cubicInOut as easing } from 'svelte/easing';
  import type { TransitionConfig } from 'svelte/transition';

  type Src = { src: string; width: number; height: number };
  type Image = {
    date: string;
    full: Src;
    mobile: Src;
    thumb: Src;
    placeholder: string;
    description: string;
    alt: string;
  };
  export let images: Image[];

  let zoom: Image & { from: Element; animationDone: boolean };

  function zoomIn(e: Event, image: Image) {
    const from = e.currentTarget as Element;
    const loaded = new Promise<string>((resolve) => {
      const img = new Image();
      img.src = image.full.src;
      img.addEventListener('load', () => resolve(image.full.src));
    });
    zoom = { ...image, from, animationDone: false };
  }

  function zoomOut() {
    zoom = null;
    // HACK: why doesn't unsetting zoom work here?
    document.querySelector('.zoom.show').classList.remove('show');
  }
  function zoomOutOnEscape(e: KeyboardEvent) {
    if (e.key === 'Escape' && zoom) zoomOut();
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
      easing: easing,
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

<svelte:window on:keydown={zoomOutOnEscape} />
<svelte:body use:disableScroll={!!zoom} />

<div class="grid">
  {#each images as img}
    <div
      class="img-container"
      role="button"
      tabindex="0"
      on:click={(e) => zoomIn(e, img)}
      on:keydown={(e) =>
        e.key === 'Enter' && (zoom ? zoomOut() : zoomIn(e, img))}
      on:touchstart
      style:aspect-ratio={img.full.width / img.full.height}
    >
      <div
        class="placeholder"
        style:background-image={`url(${img.placeholder})`}
      />
      <img
        class="mobile"
        src={img.mobile.src}
        width={img.mobile.width}
        height={img.mobile.height}
        alt={img.alt}
      />
      <img
        class="thumb"
        src={img.thumb.src}
        width={img.thumb.width}
        height={img.thumb.height}
        alt={img.alt}
      />
      <p>
        {new Date(img.date).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </div>
  {/each}
</div>
{#if zoom}
  <div class="zoom" class:show={zoom} on:click={zoomOut} on:keydown={zoomOut}>
    <figure
      transition:zoomFromElement={zoom.from}
      on:introend={() => (zoom.animationDone = true)}
      style:aspect-ratio={zoom.full.width / zoom.full.height}
      style:background-image={`${
        zoom.animationDone ? `url(${zoom.full.src}),` : ''
      }
        url(${zoom.thumb.src})`}
    >
      <!-- TODO {zoom.description || ''} -->
    </figure>
  </div>
{/if}

<style>
  .grid {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .img-container {
    display: grid;
    overflow: hidden;
    place-content: center;
    position: relative;
    width: 100%;
  }

  .placeholder {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(10px);
    height: 100%;
    position: absolute;
    scale: 1.03; /* hide bad blur at edges */
    width: 100%;
    z-index: -1;
  }

  .img-container img {
    width: 100%;
    height: auto;
  }

  img.thumb {
    display: none;
  }

  .img-container p {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    bottom: 0;
    color: #fff;
    font-feature-settings: 'lnum' 1;
    font-size: 16px;
    line-height: 1;
    margin: 0.5em;
    opacity: 0;
    padding: 0.5em 0.75em;
    position: absolute;
    right: 0;
    transition: opacity 150ms ease-in;
  }

  @media screen and (min-width: 750px) {
    .grid {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .img-container {
      height: 250px;
      width: auto;
      flex: auto;
    }
    /* TODO: select the right number of last children based on vw */
    .img-container:nth-last-child(-n + 2) {
      max-width: 450px;
    }

    img.mobile {
      display: none;
    }
    img.thumb {
      display: block;
    }

    .img-container:hover p {
      opacity: 1;
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
      z-index: 1;

      -webkit-backdrop-filter: blur(7px) opacity(0);
      backdrop-filter: blur(7px) opacity(0);
      transition: all 250ms ease-in;
    }
    .zoom.show {
      -webkit-backdrop-filter: blur(7px) opacity(1);
      backdrop-filter: blur(7px) opacity(1);
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

      /* HACK: flex/grid on parent doesn't seem to work with auto-sizing. */
      margin: 0 auto;
      position: relative;
      top: 50%;
      translate: 0 -50%;
    }

    /* TODO: move to app.css? */
    :global(body.no-scroll) {
      overflow: hidden;
    }
  }
</style>
