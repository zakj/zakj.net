<script lang="ts">
  import { DESKTOP_WIDTH, type Image } from '$util';
  import { isDesktopMedia } from '$store';
  import { createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';

  export let images: Image[];

  type SelectEvent = { image: Image; node: Element };
  const dispatch = createEventDispatcher<{ select: SelectEvent }>();

  const select = (image: Image, node: Element) =>
    dispatch('select', { image, node });
</script>

<div class="grid">
  {#each images as img (img.id)}
    {@const aspectRatio =
      img.full.attributes.width / img.full.attributes.height}
    <!-- TODO improve aria support -->
    <div
      class="img-container"
      animate:flip={{ duration: 250, easing: quintOut }}
      role="button"
      tabindex="0"
      data-id={img.id}
      on:click={(e) => select(img, e.currentTarget)}
      on:keydown={(e) => e.key === 'Enter' && select(img, e.currentTarget)}
      style:aspect-ratio={aspectRatio}
      style:max-width={$isDesktopMedia
        ? `${Math.floor(img.thumb.attributes.height * aspectRatio * 0.8)}px`
        : null}
    >
      <div
        class="placeholder"
        style:background-image={`url(${img.placeholder})`}
      />
      <picture>
        <source
          srcset={img.thumb.src}
          width={img.thumb.attributes.width}
          height={img.thumb.attributes.height}
          media={`(min-width: ${DESKTOP_WIDTH}px)`}
        />
        <img
          src={img.mobile.src}
          width={img.mobile.attributes.width}
          height={img.mobile.attributes.height}
          alt={img.alt}
          loading="lazy"
          decoding="async"
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
    padding: 6px;
  }

  .img-container {
    display: grid;
    overflow: hidden;
    place-content: center;
    position: relative;
    width: 100%;
  }

  /* TODO do I want a hover state? */
  /* .img-container:hover {
    box-shadow: var(--shadow-float);
    scale: 1.1;
    z-index: 1;
    border-radius: 4px;
  } */

  /* .img-container:hover ~ .img-container,
  .img-container:has(~ .img-container:hover) {
    filter: blur(2px);
  } */

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

  /* TODO: re-evaluate this */
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
