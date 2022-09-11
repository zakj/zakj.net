<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import type { TransitionConfig } from 'svelte/transition';

  type Image = {
    src: string;
    alt: string;
    description?: string;
  };
  export let images: Image[];

  type Zoom = Image & { from: Element };
  let zoom: Zoom;
  function zoomIn(i: number, el: HTMLImageElement) {
    zoom = { ...images[i], from: el };
  }
  function zoomOut() {
    zoom = null;
  }

  function zoomFromElement(node: Element, fromNode: Element): TransitionConfig {
    const from = fromNode.getBoundingClientRect();
    const to = node.getBoundingClientRect();

    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const dw = from.width / to.width;
    const dh = from.height / to.height;

    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;
    const opacity = +style.opacity;

    return {
      duration: 200,
      easing: cubicOut,
      css: (t, u) => `
        transform-origin: top left;
        transform: ${transform} translate(${u * dx}px, ${u * dy}px) scale(${
        t + (1 - t) * dw
      }, ${t + (1 - t) * dh});
      `,
    };
  }

  // what I want is a specialized transition function that takes an element
  // reference I guess? and transitions from the selected element reference to
  // the new final position.
  // https://svelte.dev/docs#template-syntax-element-directives-transition-fn-custom-transition-functions
  // https://github.com/sveltejs/svelte/blob/d5370f23d3d34f15078ccc8d72b80eea0617f173/src/runtime/transition/index.ts
</script>

<div class="grid">
  {#each images as img, i}
    <img
      on:click={(e) => zoomIn(i, e.currentTarget)}
      src={img.src}
      alt={img.alt}
    />
  {/each}
</div>
{#if zoom}
  <div class="zoom" on:click={zoomOut}>
    <figure transition:zoomFromElement={zoom.from}>
      <img src={zoom.src} alt={zoom.alt} />
      <!-- {zoom.description || ''} -->
    </figure>
  </div>
{/if}

<style>
  .grid {
    display: flex;
    flex-wrap: wrap;
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
    /* background: white; */
    display: flex;
    flex-direction: column;
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

  .grid img {
    object-fit: cover;
  }

  .grid img {
    cursor: zoom-in;
    flex: auto;
    height: 250px;
    /* TODO: set width instead for a single column on mobile */
    margin: 2px;
    transition: all 150ms ease-in-out;
  }
  /* .grid img:hover {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
      0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
      0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
    transform: scale(1.02);
  } */

  /* https://getcssscan.com/css-box-shadow-examples */
  .x {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12),
      0 4px 4px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.12),
      0 16px 16px rgba(0, 0, 0, 0.12);
    box-shadow: 0px 2px 4px rgb(45 35 66 / 40%),
      /* diffuse shadow behind the button */ 0px 7px 13px -3px rgb(45 35 66 /
            30%),
      /* shadow offset to the bottom for depth */ inset 0px -3px 0px #d6d6e7; /* boottom "edge" of the button */
  }
</style>
