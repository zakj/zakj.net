<script lang="ts">
  import type { Image } from '$util';
  import { flip } from 'svelte/animate';
  import { scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  interface Props {
    images: Image[];
    select: (image: Image, node: Element) => void;
  }

  const { images, select }: Props = $props();

  function formatDate(d: Date): string {
    return d.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }
</script>

<div class="grid">
  {#each images as img (img.id)}
    <div
      class="img-container"
      role="button"
      tabindex="0"
      data-id={img.id}
      transition:scale={{ duration: 250, easing: quintOut }}
      animate:flip={{ duration: 250, easing: quintOut }}
      onclick={(e) => select(img, e.currentTarget)}
      onkeydown={(e) => e.key === 'Enter' && select(img, e.currentTarget)}
      style:--aspect-ratio={img.width / img.height}
      style:--crop={img.crop}
      style:--placeholder={`url(${img.placeholder})`}
    >
      <figure>
        <img
          src={img.thumb.src}
          alt={img.alt}
          width={img.thumb.width}
          height={img.thumb.height}
          loading="lazy"
          decoding="async"
        />
        <p>{formatDate(img.date)}</p>
      </figure>
    </div>
  {/each}
  <div style:flex="10"></div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1px;
  }

  .img-container {
    aspect-ratio: 1;
    background-position: var(--crop);
    background-size: cover;
    overflow: hidden;
    position: relative;
  }

  figure {
    height: 100%;

    &::before {
      background-image: var(--placeholder);
      background-position: var(--crop);
      background-repeat: no-repeat;
      background-size: cover;
      content: '';
      display: block;
      filter: blur(5px);
      height: 100%;
      position: absolute;
      scale: 1.1; /* hide bad blur at edges */
      width: 100%;
      z-index: -1;
    }
  }

  img {
    object-fit: cover;
    object-position: var(--crop);
    height: 100%;
  }

  p {
    background: oklch(from var(--color-black) l c h / 0.3);
    text-shadow: 0px 0px 2px var(--color-black);
    border-radius: var(--radius-s);
    bottom: 0;
    color: #fff;
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
      display: flex;
      flex-wrap: wrap;
      padding-inline: 6px;
      gap: 6px;
    }
    .img-container {
      aspect-ratio: var(--aspect-ratio);
      height: 250px;
      flex: auto;
    }
    figure::before {
      filter: blur(10px);
      scale: 1.05;
    }
    :hover > p {
      opacity: 1;
    }
  }
</style>
