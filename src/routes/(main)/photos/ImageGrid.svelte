<script context="module" lang="ts">
  const refs: Record<Image['id'], Element> = {};
  export const findRef = (id: Image['id']): Element => refs[id];
</script>

<script lang="ts">
  import { isDesktopMedia } from '$lib/store';
  import { DESKTOP_WIDTH } from '$lib/util';
  import { createEventDispatcher } from 'svelte';
  import type { Image } from './+page.svelte';

  export let images: Image[];

  const dispatch = createEventDispatcher();
  const select = (id: Image['id']) => $isDesktopMedia && dispatch('select', id);
</script>

<div class="grid">
  {#each images as img}
    {@const aspectRatio = img.full.width / img.full.height}
    <div
      class="img-container"
      role="button"
      tabindex="0"
      bind:this={refs[img.id]}
      on:click={() => select(img.id)}
      on:keydown={(e) => e.key === 'Enter' && select(img.id)}
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

  img {
    height: auto;
    vertical-align: bottom;
    width: 100%;
  }

  p {
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

    :hover > p {
      opacity: 1;
    }
  }
</style>
