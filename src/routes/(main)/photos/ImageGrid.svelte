<script lang="ts">
  import { browser } from '$app/environment';
  import { isDesktopMedia } from '$lib/store';
  import { DESKTOP_WIDTH, disableScroll, zoomFromElement } from '$lib/util';
  import { createEventDispatcher } from 'svelte';

  type Src = { src: string; width: number; height: number };
  type Image = {
    id: string;
    date: string;
    full: Src;
    mobile: Src;
    thumb: Src;
    placeholder: string;
    description: string;
    alt: string;
    ref?: Element;
  };
  export let images: Image[];
  export let selected: string;

  const dispatch = createEventDispatcher();
  const select = (id: Image['id']) => $isDesktopMedia && dispatch('select', id);

  let zoom: {
    image: Image;
    animated: boolean;
    loaded: boolean;
  };
  let zoomFrom: Element;

  function zoomIn(image: Image, animated = false) {
    new Promise<void>((resolve) => {
      const img = new Image();
      img.src = image.full.src;
      img.addEventListener('load', () => (zoom.loaded = true));
    });
    zoomFrom = image.ref;
    zoom = {
      image: image,
      animated,
      loaded: false,
    };
  }

  function zoomOut() {
    // HACK: why doesn't unsetting zoom work here? https://github.com/sveltejs/svelte/issues/8061
    if (zoom) document.querySelector('.zoom.show').classList.remove('show');
    zoom = null;
  }

  const imageMap = new Map(images.map((x, i) => [x.id, i]));
  $: if (browser) {
    // XXX skip animation and scroll to item on first load
    const i = imageMap.get(selected);
    if (images[i]) zoomIn(images[i]);
    else zoomOut();
  }
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && select(null)} />
<svelte:body use:disableScroll={!!zoom} />

<div class="grid">
  {#each images as img}
    {@const aspectRatio = img.full.width / img.full.height}
    <div
      class="img-container"
      role="button"
      tabindex="0"
      bind:this={img.ref}
      on:click={() => select(img.id)}
      on:keydown={(e) => e.key === 'Enter' && select(zoom ? null : img.id)}
      on:touchstart
      style:aspect-ratio={aspectRatio}
      style:max-width={$isDesktopMedia
        ? `${Math.floor(img.thumb.height * aspectRatio * 0.8)}px`
        : null}
    >
      <div
        class="placeholder"
        style:background-image={`url(${img.placeholder})`}
      />
      <!-- TODO: turn this into a loadable-on-scroll element -->
      <picture>
        <source
          srcset={img.thumb.src}
          width={img.thumb.width}
          height={img.thumb.height}
          media={`(min-width: ${DESKTOP_WIDTH}px)`}
        />
        <img
          src={img.mobile.src}
          width={img.mobile.width}
          height={img.mobile.height}
          alt={img.alt}
        />
      </picture>
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
  <div
    class="zoom"
    class:show={!!zoom}
    on:click={() => select(null)}
    on:keydown={() => select(null)}
  >
    <!-- TODO next/prev on left/right arrow -->
    <figure
      transition:zoomFromElement={zoomFrom}
      on:introend={() => (zoom.animated = true)}
      style:aspect-ratio={zoom.image.full.width / zoom.image.full.height}
      style:background-image={`${
        zoom.animated && zoom.loaded ? `url(${zoom.image.full.src}),` : ''
      }
        url(${zoom.image.thumb.src})`}
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

    .img-container:hover p {
      opacity: 1;
    }

    .zoom {
      /* TODO: shaky on chrome */
      -webkit-backdrop-filter: blur(7px) opacity(0);
      backdrop-filter: blur(7px) opacity(0);
      cursor: zoom-out;
      display: block;
      height: 100vh;
      left: 0;
      padding: var(--padding);
      position: fixed;
      top: 0;
      transition: all 250ms ease-in;
      width: 100vw;
      z-index: 1;
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
  }
</style>
