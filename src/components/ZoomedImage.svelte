<script lang="ts">
  import type { Image } from '$util';
  import { createEventDispatcher } from 'svelte';
  import { fade, type TransitionConfig } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  export let image: Image;
  export let fromNode: Element;

  // Animating a full-size image is slow; better to animate the thumb and then switch.
  let animating = false;

  const dispatch = createEventDispatcher<{ close: null }>();
  const close = () => dispatch('close');

  // TODO utils?
  // Stolen from https://github.com/sveltejs/svelte/blob/master/src/runtime/transition/index.ts
  export function zoomFromElement(
    node: Element,
    fromNode: Element,
  ): TransitionConfig {
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
      easing: cubicInOut,
      css: (t, u) => `
          opacity: ${t * opacity};
          transform-origin: top left;
          transform: ${transform}
            translate(${u * dx}px, ${u * dy}px)
            scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
        `,
    };
  }

  $: if (image) {
    // We don't show the image while animating, but preloading it helps.
    const img = new Image();
    img.src = image.full.src;
  }

  function bgUrl(hrefs: string[]): string {
    return hrefs.map((h) => `url(${h})`).join(',');
  }
</script>

<svelte:window
  on:keydown|preventDefault={(e) => ['Escape', ' '].includes(e.key) && close()}
/>

<div role="button" tabindex="0" on:click={close} on:keydown={close}>
  <div class="backdrop" transition:fade={{ duration: 200 }} />
  <figure
    transition:zoomFromElement={fromNode}
    on:introstart={() => (animating = true)}
    on:introend={() => (animating = false)}
    style:aspect-ratio={image.full.attributes.width /
      image.full.attributes.height}
    style:background-image={animating
      ? bgUrl([image.thumb.src])
      : bgUrl([image.full.src, image.thumb.src])}
  >
    <!-- TODO (maybe) {image.description} -->
  </figure>
</div>

<style>
  /* TODO better styling on mobile? */
  div {
    --padding: 20px; /* TODO */
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
    background: rgba(0, 0, 0, 0.8);
    height: 100%;
    position: absolute;
    width: 100%;
    z-index: 0;
  }

  figure {
    border-radius: 8px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    /* TODO: shadow-float? */
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.07),
      0 2px 4px rgba(0, 0, 0, 0.07),
      0 4px 8px rgba(0, 0, 0, 0.07),
      0 8px 16px rgba(0, 0, 0, 0.07),
      0 16px 32px rgba(0, 0, 0, 0.07),
      0 32px 64px rgba(0, 0, 0, 0.07);
    max-height: calc(100vh - var(--padding) * 2);
    max-width: calc(100vw - var(--padding) * 2);
    user-select: none; /* because I keep double-clicking these things */

    /* HACK: flex/grid on parent doesn't seem to work with auto-sizing. */
    margin: 0 auto;
    position: relative;
    top: 50%;
    translate: 0 -50%;
  }
</style>
